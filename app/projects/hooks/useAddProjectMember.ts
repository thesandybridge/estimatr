import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addProjectMember = async ({ projectId, memberId }: { projectId: string; memberId: string }) => {
  const supabase = await createClient();

  // Check if the user is already in the project
  const { data: existingMember } = await supabase
    .from("project_members")
    .select("member_id")
    .eq("member_id", memberId)
    .eq("project_id", projectId)
    .single();

  if (existingMember) throw new Error("User is already a member of this project");

  // Insert the new member into the project_members table
  const { error: insertError } = await supabase
    .from("project_members")
    .insert({ member_id: memberId, project_id: projectId });

  if (insertError) throw new Error(insertError.message);

  return { memberId };
};

export default function useAddProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      await addProjectMember({ projectId, memberId }),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries(["project_members", projectId]); // Refresh project members
    },
  });
}
