"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

interface CreateProjectProps {
  name: string;
  uuid: string;
  owner: string;
  deadline: string;
}

const createProject = async ({ name, uuid, owner, deadline }: CreateProjectProps) => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User not authenticated");

  const email = user.user.email;
  if (!email) throw new Error("User email not found");

  let orgId: string | null = null;

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

  const { data, error } = await supabase.from("projects").insert({
    uuid,
    name,
    owner,
    deadline,
    org_id: orgId,
  });

  if (error) throw new Error(error.message);
  return data;
};

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
