"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LineItem } from "@/lib/lineItems";

type EditStatusInput = { id: string; project_id: string, is_editing: boolean };

const editStatus = async ({ id, project_id, is_editing }: EditStatusInput) => {
  const supabase = await createClient();

  if (!id || !project_id) throw new Error("🚨 Invalid line item ID or project ID");

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("🚨 User not authenticated");

  const { data: isMember, error: memberError } = await supabase
    .from("project_members")
    .select("member_id")
    .eq("project_id", project_id)
    .eq("member_id", user.user.id)
    .single();

  if (memberError || !isMember) throw new Error("🚨 User is not a member of this project");

  const { data, error } = await supabase.from("line_items").update({is_editing}).eq("id", id);

  if (error) {
    console.error("❌ Supabase Delete Error:", error.message);
    throw new Error(error.message);
  }

  return data;
};

export default function useSetEditStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editStatus,
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
    onSuccess: (updatedData, updatedItem) => {
      queryClient.setQueryData(["line-items", updatedItem.project_id], (old: LineItem[] = []) => {
        return old.map((item) =>
          item.id === updatedItem.id ? { ...item, ...updatedData } : item
        );
      });
    },
  });
}
