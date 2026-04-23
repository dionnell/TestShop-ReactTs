import { testShopApi } from "@/api/testShopApi";
import type { User } from "@/interface/user.interface";

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  address?: string;
}

export interface UpdateProfileResponse {
  user: User;
  token: string;
}

export const updateProfileAction = async (
  dto: UpdateProfileDto
): Promise<UpdateProfileResponse> => {
  const { data } = await testShopApi.patch<UpdateProfileResponse>("/auth/profile", dto);
  return data;
};