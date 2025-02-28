import { Project } from "@/lib/projects";
import { createClient } from "@/utils/supabase/client";
import { useQuery, UseQueryResult  } from "@tanstack/react-query";

const fetchProjects = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")

  if (error) throw new Error(error.message)
  return data
}

export default function useFetchProjects(): UseQueryResult<Project[]> {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  })
}
