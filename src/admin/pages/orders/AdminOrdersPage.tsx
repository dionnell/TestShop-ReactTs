import { AdminTitle } from "@/admin/components/AdminTitle"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/currency-formatter"
import { useAllOrders } from "@/admin/hooks/useAdminPayment"
import { ChevronDown, Package, XCircle } from "lucide-react"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import type { AdminPayment } from "@/admin/action/getOrdersByUser.action"
import { OrderDetailModal } from "@/admin/components/OrderDetailModal"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { useSearchParams } from "react-router"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

const statusLabel: Record<string, { label: string; color: string }> = {
  approved: { label: "Aprobado",  color: "bg-green-100 text-green-700" },
  pending:  { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  failed:   { label: "Fallido",   color: "bg-red-100 text-red-700" },
  cancelled:{ label: "Cancelado", color: "bg-gray-100 text-gray-600" },
}

export const AdminOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: payments, isLoading, isError, cancelPayment, isCancellingPayment, cancellingId } = useAllOrders()
  const [selected, setSelected] = useState<AdminPayment | null>(null)
  const currentStatus = searchParams.get("status") || "all"
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id)
  }

  const statuses = [
    { id: "all",       label: "Todos",     color: "bg-gray-100 text-gray-600" },
    { id: "approved",  label: "Aprobado",  color: "bg-green-100 text-green-700" },
    { id: "pending",   label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
    { id: "failed",    label: "Fallido",   color: "bg-red-100 text-red-700" },
    { id: "cancelled", label: "Cancelado", color: "bg-gray-100 text-gray-600" },
  ]

  const handleStatusChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === "all") {
      newParams.delete("status")
    } else {
      newParams.set("status", value)
    }
    newParams.delete("page")
    setSearchParams(newParams)
  }

  const handleCancel = (id: string) => {
    cancelPayment(id, {
      onSuccess: () => toast.success("Orden cancelada exitosamente", { position: "top-right", richColors: true }),
      onError: () => toast.error("Error al cancelar la orden", { position: "top-right", richColors: true }),
    })
  }

  if (isLoading) return <CustomFullScreenLoading />

  if (isError || !payments) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudieron cargar las órdenes. Intenta de nuevo.
      </div>
    )
  }

  return (
    <>
      <AdminTitle
        title="Órdenes"
        subtitle="Aquí puedes ver todas las órdenes realizadas en la tienda"
      />

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status.id}
            variant={currentStatus === status.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(status.id)}
            className={currentStatus === status.id ? status.color : ""}
          >
            {status.label}
            {currentStatus === status.id && payments && (
              <span className="ml-1">({payments.count})</span>
            )}
          </Button>
        ))}
      </div>

      {
        payments.count === 0 ? (
          <div className="p-6 text-center text-red-500">
            No hay órdenes para mostrar.
          </div>
        ) : 
        <>
          <Table className="bg-white shadow-xs border-2 border-gray-200 mb-10 ">
            <TableHeader>
              <TableRow>
                <TableHead className="w-px"></TableHead>  {/* chevron */}
                <TableHead className="max-sm:w-px">Orden</TableHead>
                <TableHead className="max-sm:w-px">Estado</TableHead>
                <TableHead className="max-sm:w-px">Total</TableHead>
                <TableHead className="hidden md:table-cell">Usuario</TableHead>
                <TableHead className="hidden lg:table-cell">Productos</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Detalle</TableHead>
                <TableHead className="text-center">Cancelar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.payments.map((payment) => {
                const st = statusLabel[payment.status] ?? {
                  label: payment.status,
                  color: "bg-gray-100 text-gray-600",
                }
                const isCancelling = isCancellingPayment && cancellingId === payment.id
                const isExpanded = expandedRow === payment.id
              
                return (
                  <React.Fragment key={payment.id}>
                    <TableRow className="cursor-pointer"
                      onClick={() => toggleRow(payment.id)}
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
                      {/* Numero de orden */}
                      <TableCell className="font-mono text-xs text-gray-700">
                        <span className="hidden sm:inline">{payment.buyOrder}</span>
                        <span className="sm:hidden">{payment.buyOrder.slice(0, 8)}…</span>
                      </TableCell>

                      {/* Estado */}  
                      <TableCell>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>
                          {st.label}
                        </span>
                      </TableCell>

                      {/* Total */}  
                      <TableCell className="font-semibold text-gray-900">
                        {formatCurrency(payment.amount, "CLP")}
                      </TableCell>
                        
                      {/* Usuario */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 ">
                          <div className="h-7 w-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">
                              {(payment as any).user?.fullName
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                              {(payment as any).user?.fullName ?? "—"}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">
                              {(payment as any).user?.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Productos images*/}        
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex -space-x-2">
                          {payment.items.slice(0, 3).map((item) => (
                            item.product?.images?.[0] ? (
                              <img
                                key={item.id}
                                src={item.product.images[0]}
                                alt={item.product.title ?? ""}
                                className="h-8 w-8 rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div
                                key={item.id}
                                className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center"
                              >
                                <Package className="h-3 w-3 text-gray-400" />
                              </div>
                            )
                          ))}
                          {payment.items.length > 3 && (
                            <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                +{payment.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Fecha */}  
                      <TableCell className="hidden md:table-cell text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString("es-CL", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </TableCell>
                      
                      {/* Columna detalle */}
                      <TableCell className="hidden sm:table-cell text-center"
                        onClick={(e) => e.stopPropagation()} // evita toggle al clickear botón
                      >
                        <Button size="sm" variant="outline" className="h-7 text-xs"
                          onClick={() => setSelected(payment)}>
                          Ver detalle
                        </Button>
                      </TableCell>
                      
                      {/* Columna cancelar */}
                      <TableCell 
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {payment.status === "approved" ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                disabled={isCancelling}
                              >
                                <XCircle className="sm:inline h-4 w-4 " />
                                <span className="hidden sm:inline">
                                  {isCancelling ? "Cancelando..." : "Cancelar"}
                                </span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancelar pago</AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogDescription>
                                ¿Estás seguro de que quieres cancelar este pago? Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction variant='destructive' onClick={() => handleCancel(payment.id)}>
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                    {/* Fila de detalle colapsable — solo visible en móvil */}
                    {isExpanded && (
                      <TableRow className="md:hidden bg-gray-50">
                        <TableCell colSpan={5} className="py-3 px-4">
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Orden completa</span>
                              <span className="font-mono text-gray-700">{payment.buyOrder}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Usuario</span>
                              <span className="font-medium">{(payment as any).user?.fullName ?? "—"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Email</span>
                              <span className="text-gray-700">{(payment as any).user?.email ?? "—"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Fecha</span>
                              <span className="text-gray-700">
                                {new Date(payment.createdAt).toLocaleDateString("es-CL", {
                                  year: "numeric", month: "short", day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Detalle</span>
                              <Button size="sm" variant="outline" className="h-6 text-xs"
                                onClick={(e) => { e.stopPropagation(); setSelected(payment) }}>
                                Ver detalle
                              </Button>
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
            
          <CustomPagination totalPages={payments?.pages || 0} />
        </>
      }
      <OrderDetailModal payment={selected} onClose={() => setSelected(null)} />
    </>
  )
}