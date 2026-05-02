import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersAction } from "../action/getUsers.action";
import { updateUserAction, type UpdateUserDto } from "../action/updateUser.action";
import { useSearchParams } from "react-router";

export const useUsers = () => {
  const queryClient = useQueryClient();
  const [ searchParams ] = useSearchParams()

  const q = searchParams.get('query') || ''
  const limit = searchParams.get('limit') || 9
  const page = searchParams.get('page') || 1
  const offset = (Number(page) -1 ) * Number(limit)

  const query = useQuery({
    queryKey: ["admin-users", {limit, offset, query: q}],
    queryFn: () => getUsersAction({ 
      query: q || undefined, 
      limit: isNaN(+limit) ? 0 : limit, 
      offset: isNaN(offset) ? 0 : offset
    }),
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