import { Project } from "@/lib/projects";
import { createClient } from "@/utils/supabase/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchProject = async (uuid: string) => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User not authenticated");

  const { data: orgData } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("member_id", user.user.id)
    .single();

  const orgId = orgData?.org_id || null;

  let query = supabase.from("projects").select("*").eq("uuid", uuid).single();

  // If user has an org, filter by org_id
  if (orgId) {
    query = query.eq("org_id", orgId);
  } else {
    query = query.is("org_id", null);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export default function useFetchProject(uuid: string): UseQueryResult<Project> {
  return useQuery({
    queryKey: ["projects", uuid],
    queryFn: async () => await fetchProject(uuid),
  });
}
