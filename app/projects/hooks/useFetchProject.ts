import { Project } from "@/lib/projects";
import { createClient } from "@/utils/supabase/client";
import { useQuery, UseQueryResult  } from "@tanstack/react-query";

const fetchProject = async (uuid: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("uuid", uuid)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export default function useFetchProject(uuid: string): UseQueryResult<Project> {
  return useQuery({
    queryKey: ["projects", uuid],
    queryFn: async () => await fetchProject(uuid),
  })
}
