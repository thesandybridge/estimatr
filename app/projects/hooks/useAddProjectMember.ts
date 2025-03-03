import { createClient } from "@/utils/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addProjectMember = async ({ projectId, memberId }: { projectId: string; memberId: string }) => {
  const supabase = createClient();

  const { error: insertError } = await supabase
    .from("project_members")
    .insert({ member_id: memberId, project_id: projectId });

  if (insertError) throw new Error(insertError.message);

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email, name, avatar_url")
    .eq("id", memberId)
    .single();

  if (userError) throw new Error(userError.message);

  return { projectId, user: userData };
};

export default function useAddProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectMember,

    onMutate: async ({ projectId, memberId }) => {
      await queryClient.cancelQueries(["project_members", projectId]);

      const previousMembers = queryClient.getQueryData(["project_members", projectId]);

      const optimisticUser = {
        id: memberId,
        email: "Fetching...",
        name: "Fetching...",
        avatar_url: "",
      };

      queryClient.setQueryData(["project_members", projectId], (oldData: any) => {
        return oldData ? [...oldData, optimisticUser] : [optimisticUser];
      });

      return { previousMembers };
    },

    onError: (_error, { projectId }, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["project_members", projectId], context.previousMembers);
      }
    },

    onSuccess: ({ projectId, user }) => {
      queryClient.setQueryData(["project_members", projectId], (oldData: any) => {
        return oldData?.map((member: any) =>
          member.id === user.id ? user : member
        );
      });

      queryClient.invalidateQueries(["project_members", projectId]);
    },
  });
}
