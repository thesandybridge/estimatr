import { createClient } from "@/utils/supabase/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface OrgMember {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

const fetchOrgMembers = async (): Promise<OrgMember[]> => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("User not authenticated");

  const { data: orgData, error: orgError } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("member_id", user.user.id)
    .single();

  if (orgError || !orgData) throw new Error("User is not part of any organization");

  const { data, error } = await supabase
    .from("org_members")
    .select("member_id, users(email, name, avatar_url)")
    .eq("org_id", orgData.org_id);

  if (error) throw new Error(error.message);

  return data.map((member) => ({
    id: member.member_id,
    email: member.users?.email,
    name: member.users?.name,
    avatar_url: member.users?.avatar_url,
  }));
};

export default function useFetchOrgMembers(): UseQueryResult<OrgMember[]> {
  return useQuery({
    queryKey: ["org_members"],
    queryFn: async () => await fetchOrgMembers(),
  });
}
