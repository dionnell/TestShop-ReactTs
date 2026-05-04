import { AdminTitle } from "@/admin/components/AdminTitle"
import { useUsers } from "@/admin/hooks/useUsers"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingBag, Pencil, ChevronDown } from "lucide-react"
import { useState } from "react"
import React from "react"
import type { AdminUser } from "@/admin/action/getUsers.action"
import { OrdersModal } from "@/admin/components/OrdersModal"
import { EditUserModal } from "@/admin/components/EditUserModal"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { cn } from "@/lib/utils"

export const AdminUsers = () => {
  const { data: users, isLoading, isError } = useUsers()
  const [ordersUser, setOrdersUser] = useState<AdminUser | null>(null)
  const [editUser, setEditUser]     = useState<AdminUser | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id)
  }

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
            <TableHead className="w-px" />
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Teléfono</TableHead>
            <TableHead className="hidden sm:table-cell">Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden lg:table-cell">Miembro desde</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.users.map((user) => {
            const isExpanded = expandedRow === user.id
            return (
              <React.Fragment key={user.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(user.id)}
                >
                  {/* Chevron */}
                  <TableCell className="w-px pr-0">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200 md:hidden",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">
                          {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 truncate max-w-[90px] sm:max-w-[140px] ">
                        {user.fullName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="hidden sm:table-cell text-gray-600 max-w-[180px] truncate">
                    {user.email}
                  </TableCell>

                  {/* Teléfono */}
                  <TableCell className="hidden md:table-cell text-gray-600">
                    {user.phone ?? <span className="italic text-gray-400 text-xs">Sin teléfono</span>}
                  </TableCell>

                  {/* Roles */}
                  <TableCell className="hidden sm:table-cell">
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

                  {/* Estado */}
                  <TableCell>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    )}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="hidden lg:table-cell text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("es-CL", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm" variant="outline"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => setOrdersUser(user)}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Órdenes</span>
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="h-8 gap-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => setEditUser(user)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Fila colapsable */}
                {isExpanded && (
                  <TableRow className="md:hidden bg-gray-50 hover:bg-gray-50">
                    <TableCell colSpan={8} className="py-3 px-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email</span>
                          <span className="text-gray-700 truncate max-w-[200px]">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Teléfono</span>
                          <span className="text-gray-700">{user.phone ?? <span className="italic text-gray-400">Sin teléfono</span>}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Roles</span>
                          <div className="flex gap-1">
                            {user.roles.map((role) => (
                              <Badge key={role} variant={role === "admin" ? "default" : "secondary"} className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Miembro desde</span>
                          <span className="text-gray-700">
                            {new Date(user.createdAt).toLocaleDateString("es-CL", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>

      <CustomPagination totalPages={users?.pages || 0} />
      <OrdersModal user={ordersUser} onClose={() => setOrdersUser(null)} />
      <EditUserModal user={editUser} onClose={() => setEditUser(null)} />
    </>
  )
}