'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

const deleteProject = async (uuid) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects")
    .delete()
    .eq('uuid', uuid)

  if (error) throw new Error(error.message)
  return data
};

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    }
  });
}
