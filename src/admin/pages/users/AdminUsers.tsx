import { AdminTitle } from "@/admin/components/AdminTitle"
import { useUsers } from "@/admin/hooks/useUsers"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingBag, Pencil } from "lucide-react"
import { useState } from "react"
import type { AdminUser } from "@/admin/action/getUsers.action"
import { OrdersModal } from "@/admin/components/OrdersModal"
import { EditUserModal } from "@/admin/components/EditUserModal"


export const AdminUsers = () => {
  const { data: users, isLoading, isError } = useUsers()
  const [ordersUser, setOrdersUser] = useState<AdminUser | null>(null)
  const [editUser, setEditUser]     = useState<AdminUser | null>(null)

  if (isLoading) return <CustomFullScreenLoading />

  if (isError || !users) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudieron cargar los usuarios. Intenta de nuevo.
      </div>
    )
  }

  return (
    <>
      <AdminTitle
        title="Usuarios"
        subtitle="Aquí puedes ver y gestionar todos los usuarios registrados"
      />

      <Table className="bg-white shadow-xs border-2 border-gray-200 mb-10">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Miembro desde</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              {/* Avatar + name */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">
                      {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 max-w-[140px] truncate">{user.fullName}</span>
                </div>
              </TableCell>

              <TableCell className="text-gray-600 max-w-[180px] truncate">{user.email}</TableCell>

              <TableCell className="text-gray-600">
                {user.phone ?? <span className="italic text-gray-400 text-xs">Sin teléfono</span>}
              </TableCell>

              {/* Roles */}
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge
                      key={role}
                      variant={role === "admin" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              {/* Active status */}
              <TableCell>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </TableCell>

              <TableCell className="text-gray-500 text-xs">
                {new Date(user.createdAt).toLocaleDateString("es-CL", {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => setOrdersUser(user)}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Órdenes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => setEditUser(user)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modals */}
      <OrdersModal user={ordersUser} onClose={() => setOrdersUser(null)} />
      <EditUserModal   user={editUser}   onClose={() => setEditUser(null)} />
    </>
  )
}