import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersAction } from "../action/getUsers.action";
import { updateUserAction, type UpdateUserDto } from "../action/updateUser.action";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsersAction,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      updateUserAction(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return {
    ...query,
    updateUser: updateMutation.mutate,
    isUpdatingUser: updateMutation.isPending,
    updateUserError: updateMutation.error,
  };
};