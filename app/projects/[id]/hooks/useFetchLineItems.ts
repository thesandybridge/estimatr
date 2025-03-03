"use client";

import { LineItem } from "@/lib/lineItems";
import { createClient } from "@/utils/supabase/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchLineItems = async (projectId: string): Promise<LineItem[]> => {
  if (!projectId) throw new Error("🚨 Project ID is required");

  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("🚨 User not authenticated");

  console.log("✅ Fetching line items for project:", projectId);

  const { data: lineItems, error: lineItemsError } = await supabase
    .from("line_items")
    .select("*")
    .eq("project_id", projectId);

  if (lineItemsError) throw new Error(lineItemsError.message);

  return lineItems ?? [];
};

export default function useFetchLineItems(projectId: string): UseQueryResult<LineItem[]> {
  return useQuery({
    queryKey: ["line-items", projectId],
    queryFn: async () => await fetchLineItems(projectId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!projectId,
  });
}
