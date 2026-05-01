import { useQueryClient } from "@tanstack/react-query"
import type { AdminUser } from "../action/getUsers.action"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { testShopApi } from "@/api/testShopApi"
import { toast } from "sonner"
import { Pencil } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
}

export const EditUserModal = ({ user, onClose }: EditUserModalProps) => {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<EditForm>({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    email: user?.email ?? "",
    roles: user?.roles ?? [],
    isActive: user?.isActive ?? false
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user) return

    setForm({
      fullName: user.fullName ?? "",
      phone: user.phone ?? "",
      address: user.address ?? "",
      email: user.email ?? "",
      roles: user.roles ?? [],
      isActive: user.isActive ?? false
    })
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await testShopApi.patch(`/auth/users/${user.id}`, form)
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast.success("Usuario actualizado", { position: "top-right", richColors: true })
      onClose()
    } catch {
      toast.error("Error al actualizar el usuario", { position: "top-right", richColors: true })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Editar usuario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre completo</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Nombre completo"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+56912345678"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Dirección</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Av. Ejemplo 1234, Santiago"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="usuario@ejemplo.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Roles</Label>
            <Select
              value={form.roles.join(", ")}
              onValueChange={(value) => setForm((f) => ({ ...f, roles: value.split(", ") }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="superUser">Super Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Active</Label>
            <Select
              value={form.isActive ? "active" : "inactive"}
              onValueChange={(value) => setForm((f) => ({ ...f, isActive: value === "active" }))}
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

        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
