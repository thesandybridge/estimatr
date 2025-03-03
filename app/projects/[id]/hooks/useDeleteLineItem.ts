"use client";

import { LineItem } from "@/lib/lineItems";
import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteLineItem = async (id: string) => {
  const supabase = await createClient();

  if (!id) throw new Error("🚨 Invalid line item ID");

  console.log("🗑️ Deleting line item:", id);

  const { error } = await supabase.from("line_items").delete().eq("id", id);

  if (error) {
    console.error("❌ Supabase Delete Error:", error.message);
    throw new Error(error.message);
  }

  console.log("✅ Line item deleted successfully:", id);
  return id;
};

export default function useDeleteLineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLineItem,
    onMutate: async (id) => {
      console.log("⚡ Optimistically removing line item:", id);

      await queryClient.cancelQueries(["line-items"]);

      const previousLineItems = queryClient.getQueryData<string[]>(["line-items"]);

      queryClient.setQueryData(["line-items"], (old: LineItem[] = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousLineItems };
    },
    onError: (_error, id, context) => {
      console.error("❌ Error deleting line item:", _error);

      // Rollback if delete fails
      if (context?.previousLineItems) {
        console.log("🔄 Rolling back deletion...");
        queryClient.setQueryData(["line-items"], context.previousLineItems);
      }
    },
    onSettled: () => {
      console.log("🔄 Invalidating line items query...");
      queryClient.invalidateQueries(["line-items"]);
    },
  });
}
