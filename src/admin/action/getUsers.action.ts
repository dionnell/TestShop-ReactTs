import { testShopApi } from "@/api/testShopApi";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  phone: string | null;
  address: string | null;
  createdAt: string;
}

export const getUsersAction = async (): Promise<AdminUser[]> => {
  const { data } = await testShopApi.get<AdminUser[]>('/auth/users');
  return data;
};