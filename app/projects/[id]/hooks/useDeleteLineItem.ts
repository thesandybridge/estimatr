"use client";

import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LineItem } from "@/lib/lineItems";

type DeleteLineItemInput = { id: string; project_id: string };

const deleteLineItem = async ({ id, project_id }: DeleteLineItemInput) => {
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

  const { error } = await supabase.from("line_items").delete().eq("id", id);

  if (error) {
    console.error("❌ Supabase Delete Error:", error.message);
    throw new Error(error.message);
  }

  return { id, project_id };
};

export default function useDeleteLineItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLineItem,

    onMutate: async ({ id, project_id }) => {

      await queryClient.cancelQueries(["line-items", project_id]);

      const previousLineItems = queryClient.getQueryData<LineItem[]>(["line-items", project_id]);

      queryClient.setQueryData(["line-items", project_id], (old: LineItem[] = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousLineItems };
    },

    onError: (_error, { id, project_id }, context) => {
      console.error("❌ Error deleting line item:", _error);

      if (context?.previousLineItems) {
        console.log("🔄 Rolling back deletion...", { id, project_id });
        queryClient.setQueryData(["line-items", project_id], context.previousLineItems);
      }
    },

    onSettled: (_data, _error, { project_id }) => {
      if (project_id) {
        queryClient.invalidateQueries(["line-items", project_id]);
      }
    },
  });
}
