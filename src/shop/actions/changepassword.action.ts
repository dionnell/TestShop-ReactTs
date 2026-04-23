import { testShopApi } from "@/api/testShopApi";

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePasswordAction = async (
  dto: ChangePasswordDto
): Promise<ChangePasswordResponse> => {
  const { data } = await testShopApi.patch<ChangePasswordResponse>("/auth/change-password", dto);
  return data;
};