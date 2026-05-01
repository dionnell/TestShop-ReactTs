import type { AdminUser } from "../action/getUsers.action"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Pencil, Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsers } from "../hooks/useUsers"

interface EditUserModalProps {
  user: AdminUser | null
  onClose: () => void
}

interface EditForm {
  fullName: string
  phone: string
  address: string
  email: string
  roles: string[]
  isActive: boolean
  password: string
}

const AVAILABLE_ROLES = [
  { value: "user",       label: "Usuario" },
  { value: "admin",      label: "Administrador" },
  { value: "super-user", label: "Super Usuario" },
]

export const EditUserModal = ({ user, onClose }: EditUserModalProps) => {
  const { updateUser, isUpdatingUser } = useUsers()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EditForm>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      email: "",
      roles: [],
      isActive: true,
      password: "",
    },
  })

  useEffect(() => {
    if (!user) return
    reset({
      fullName: user.fullName ?? "",
      phone:    user.phone ?? "",
      address:  user.address ?? "",
      email:    user.email ?? "",
      roles:    user.roles ?? [],
      isActive: user.isActive ?? true,
      password: "",
    })
    setShowPassword(false)
  }, [user, reset])

  const selectedRoles = watch("roles")

  const toggleRole = (role: string) => {
    const current = selectedRoles ?? []
    const updated = current.includes(role)
      ? current.filter((r) => r !== role)
      : [...current, role]
    setValue("roles", updated)
  }

  const onSubmit = handleSubmit((data) => {
    if (!user) return

    // Si el password está vacío, no lo enviamos
    const dto: Partial<EditForm> = { ...data }
    if (!dto.password) delete dto.password

    updateUser(
      { id: user.id, dto },
      {
        onSuccess: () => {
          toast.success("Usuario actualizado", { position: "top-right", richColors: true })
          onClose()
        },
        onError: () => {
          toast.error("Error al actualizar el usuario", { position: "top-right", richColors: true })
        },
      }
    )
  })

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md max-h-11/12 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Editar usuario
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre completo</Label>
            <Input placeholder="Nombre completo" 
              {...register("fullName", {
                validate: (value) => {
                  if (value.length < 3) return "Mínimo 3 caracteres"
                  return true
                }
              })} 
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input placeholder="+56912345678" {
              ...register("phone", {
                validate: (value => {
                  if(!value || value.length === 0) return true
                  if(value.length < 8) return "Mínimo 8 dígitos"
                  if(!/^\+?\d+$/.test(value)) return "Solo números y opcionalmente un + al inicio"
                  return true
                })
              })} 
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Dirección</Label>
            <Input placeholder="Av. Ejemplo 1234, Santiago" {...register("address")} />
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input placeholder="usuario@ejemplo.com" type='email' {...register("email")} />
          </div>

          {/* Password — opcional, solo se envía si se rellena */}
          <div className="space-y-1.5">
            <Label>
              Nueva contraseña{" "}
              <span className="text-xs text-gray-400 font-normal">(dejar vacío para no cambiar)</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                {...register("password", {
                  validate: (value) => {
                    if (!value) return true
                    if (value.length < 6) return "Mínimo 6 caracteres"
                    if (!/(?=.*\d)/.test(value) && !/(?=.*\W)/.test(value)) return "Debe incluir un número o símbolo"
                    if (!/(?=.*[A-Z])/.test(value)) return "Debe incluir una mayúscula"
                    if (!/(?=.*[a-z])/.test(value)) return "Debe incluir una minúscula"
                    return true
                  }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Roles — multi-select con checkboxes */}
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="rounded-md border px-3 py-2.5 space-y-2">
              {AVAILABLE_ROLES.map((role) => (
                <div key={role.value} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`role-${role.value}`}
                    checked={selectedRoles?.includes(role.value) ?? false}
                    onCheckedChange={() => toggleRole(role.value)}
                  />
                  <label
                    htmlFor={`role-${role.value}`}
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    {role.label}
                  </label>
                </div>
              ))}
            </div>
            {selectedRoles?.length === 0 && (
              <p className="text-xs text-red-500">Selecciona al menos un rol</p>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select
              value={watch("isActive") ? "active" : "inactive"}
              onValueChange={(value) => setValue("isActive", value === "active")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isUpdatingUser || !selectedRoles?.length}
            >
              {isUpdatingUser ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}