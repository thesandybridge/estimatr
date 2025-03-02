"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Project } from "@/lib/projects";

interface UpdateProjectProps {
  projectId: string;
  data: Partial<Project>;
}

const updateProject = async ({ projectId, data }: UpdateProjectProps) => {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User not authenticated");

  const email = user.user.email;
  if (!email) throw new Error("User email not found");

  let orgId: string | null = null;

  // Fetch user's organization ID if they have one
  if (!email.endsWith("@gmail.com")) {
    const { data: orgData, error: orgError } = await supabase
      .from("org_members")
      .select("org_id")
      .eq("member_id", user.user.id)
      .single();

    if (!orgError && orgData) {
      orgId = orgData.org_id;
    }
  }

  // Fetch project to check if user has access
  const { data: projectAccess, error: accessError } = await supabase
    .from("projects")
    .select("uuid, org_id")
    .eq("uuid", projectId)
    .maybeSingle();

  if (accessError) throw accessError;
  if (!projectAccess) throw new Error("Project not found or access denied");

  // Ensure the user can only update projects they have access to
  if (projectAccess.org_id !== orgId && projectAccess.org_id !== null) {
    throw new Error("Unauthorized to update this project");
  }

  // Update project
  const { data: updatedProject, error: updateError } = await supabase
    .from("projects")
    .update(data)
    .eq("uuid", projectId)
    .select("*")
    .single();

  if (updateError) throw updateError;
  return updatedProject;
};

export default function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onMutate: async ({ projectId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["projects", projectId] });
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProject = queryClient.getQueryData(["projects", projectId]);
      const previousProjects = queryClient.getQueryData(["projects"]);

      // Optimistically update the cache
      if (previousProject) {
        queryClient.setQueryData(["projects", projectId], (old: Project) => ({
          ...old,
          ...data,
        }));
      }

      if (previousProjects) {
        queryClient.setQueryData(["projects"], (old: Project[]) =>
          old?.map((project) =>
            project.uuid === projectId ? { ...project, ...data } : project
          )
        );
      }

      // Return a context object with the snapshotted value
      return { previousProject, previousProjects };
    },
    onError: (err, variables, context) => {
      // Rollback if mutation fails
      if (context?.previousProject) {
        queryClient.setQueryData(["projects", variables.projectId], context.previousProject);
      }
      if (context?.previousProjects) {
        queryClient.setQueryData(["projects"], context.previousProjects);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
