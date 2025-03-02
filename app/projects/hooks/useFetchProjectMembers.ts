import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchProjectMembers = async (projectId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_members")
    .select("member_id, users:users(id, email, name, avatar_url)")
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);

  return data.map((member) => ({
    id: member.users?.id,
    email: member.users?.email,
    name: member.users?.name,
    avatar_url: member.users?.avatar_url,
  }));
};

export default function useFetchProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project_members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
  });
}
