"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LineItem } from "@/lib/lineItems";

type UpdateLineItemInput = Partial<Omit<LineItem, "created_at">> & { id: string };

const updateLineItem = async (input: UpdateLineItemInput) => {
  const supabase = await createClient();

  if (!input.id) throw new Error("🚨 Invalid line item ID");

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("🚨 User not authenticated");

  const { data: isMember, error: memberError } = await supabase
    .from("project_members")
    .select("member_id")
    .eq("project_id", input.project_id)
    .eq("member_id", user.user.id)
    .single();

  if (memberError || !isMember) throw new Error("🚨 User is not a member of this project");

  const { data, error } = await supabase
    .from("line_items")
    .update({
      name: input.name ?? undefined,
      start_date: input.start_date ?? undefined,
      end_date: input.end_date ?? undefined,
      assignee: input.assignee ?? undefined,
      complexity: input.complexity ?? undefined,
      estimated_hours: input.estimated_hours ?? undefined,
      status: input.status ?? undefined,
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    console.error("❌ Supabase Update Error:", error.message);
    throw new Error(error.message);
  }

  console.log("✅ Line item updated:", data);
  return data;
};

export default function useUpdateLineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLineItem,
    onMutate: async (updatedItem) => {
      if (!updatedItem.id) {
        console.error("🚨 Attempted to update a line item without an ID");
        return;
      }

      await queryClient.cancelQueries(["line-items", updatedItem.project_id]);

      const previousLineItems = queryClient.getQueryData<LineItem[]>(["line-items", updatedItem.project_id]);

      if (!previousLineItems) return;

      queryClient.setQueryData(["line-items", updatedItem.project_id], (old: LineItem[] = []) => {
        return old.map((item) =>
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        );
      });

      return { previousLineItems };
    },
    onError: (_error, updatedItem, context) => {
      console.error("❌ Error updating line item:", _error);

      if (context?.previousLineItems) {
        console.log("🔄 Reverting to previous state...");
        queryClient.setQueryData(["line-items", updatedItem.project_id], context.previousLineItems);
      }
    },
    onSuccess: (_data, updatedItem) => {
      console.log("🔄 Forcing UI order persistence...");
      queryClient.invalidateQueries(["line-items", updatedItem.project_id], { refetchType: "none" });
    },
  });
}
