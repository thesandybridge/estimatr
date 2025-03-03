"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LineItem } from "@/lib/lineItems";

type CreateLineItemInput = Omit<LineItem, "id" | "created_at">;

const createLineItem = async (input: CreateLineItemInput) => {
  const supabase = await createClient();

  if (!input.project_id) throw new Error("🚨 Invalid project ID");

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
    .insert([{
      project_id: input.project_id,
      name: input.name,
      start_date: input.start_date,
      end_date: input.end_date,
      assignee: input.assignee,
      complexity: input.complexity,
      estimated_hours: input.estimated_hours,
      status: input.status,
    }])
    .select();

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    throw new Error(error.message);
  }

  return data;
};

export default function useCreateLineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLineItem,
    onMutate: async (newLineItem) => {
      if (!newLineItem.project_id) {
        console.error("🚨 Attempted to add a line item without a project ID");
        return;
      }

      await queryClient.cancelQueries(["line-items", newLineItem.project_id]);

      const previousLineItems = queryClient.getQueryData<LineItem[]>(["line-items", newLineItem.project_id]);

      queryClient.setQueryData(["line-items", newLineItem.project_id], (old: LineItem[] = []) => [
        ...old,
        { ...newLineItem,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        },
      ]);

      return { previousLineItems };
    },
    onError: (_error, newLineItem, context) => {
      console.error("❌ Error creating line item:", _error);

      if (context?.previousLineItems) {
        console.log("🔄 Reverting to previous state...");
        queryClient.setQueryData(["line-items", newLineItem.project_id], context.previousLineItems);
      }
    },
    onSettled: (_data, _error, newLineItem) => {
      if (newLineItem.project_id) {
        queryClient.invalidateQueries(["line-items", newLineItem.project_id]);
      }
    },
  });
}
