import { useQuery } from "@tanstack/react-query";
import { getUsersAction } from "../action/getUsers.action";

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsersAction,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};