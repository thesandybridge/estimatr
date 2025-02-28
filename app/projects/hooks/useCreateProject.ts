'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

interface CreateProjectProps {
  name: string,
  uuid: string,
  owner: string,
  deadline: string,
}
const createProject = async ({ name, uuid, owner, deadline }: CreateProjectProps) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects")
    .insert({
      uuid,
      name,
      owner,
      deadline,
    })
  if (error) throw new Error(error.message)
  return data
};

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    }
  });
}
