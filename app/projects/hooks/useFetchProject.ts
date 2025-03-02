import { Project } from "@/lib/projects";
import { createClient } from "@/utils/supabase/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchProject = async (uuid: string) => {
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

  let query = supabase.from("projects").select("*").eq("uuid", uuid).single();

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
