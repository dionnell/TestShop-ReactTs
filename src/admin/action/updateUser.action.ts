import { testShopApi } from "@/api/testShopApi";
import type { AdminUser } from "./getUsers.action";

export interface UpdateUserDto {
  fullName?: string;
  phone?: string;
  address?: string;
  email?: string;
  roles?: string[];
  isActive?: boolean;
}

export const updateUserAction = async (
  id: string,
  dto: UpdateUserDto
): Promise<AdminUser> => {
  const { data } = await testShopApi.patch<AdminUser>(`/auth/users/${id}`, dto);
  return data;
};