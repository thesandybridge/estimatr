import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchUserOrg = async () => {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  const { data: org, error } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("member_id", user.user.id)
    .single();

  if (error || !org) return null;

  return org.org_id;
};

export default function useFetchUserOrg() {
  return useQuery({
    queryKey: ["user_org"],
    queryFn: fetchUserOrg,
  });
}
