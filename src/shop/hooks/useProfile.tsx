import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/auth/store/auth.store"
import { updateProfileAction, type UpdateProfileDto } from "../actions/updateprofile.action"
import { changePasswordAction, type ChangePasswordDto } from "../actions/changepassword.action"

export const useProfile = () => {
  const updateMutation = useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfileAction(dto),
    onSuccess: ({ user, token }) => {
      localStorage.setItem("token", token)
      useAuthStore.setState({ user, token })
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: (dto: ChangePasswordDto) => changePasswordAction(dto),
  })

  return {
    updateProfile: updateMutation.mutate,
    isUpdatingProfile: updateMutation.isPending,
    updateProfileError: updateMutation.error,

    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
  }
}