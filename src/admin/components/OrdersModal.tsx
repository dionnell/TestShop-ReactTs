import type { AdminUser } from "../action/getUsers.action"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, ShoppingBag } from "lucide-react"
import { formatCurrency } from "@/lib/currency-formatter"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminPayment } from "../hooks/useAdminPayment"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const statusLabel: Record<string, { label: string; color: string }> = {
  approved: { label: "Aprobado",  color: "bg-green-100 text-green-700" },
  pending:  { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  failed:   { label: "Fallido",   color: "bg-red-100 text-red-700" },
  cancelled:{ label: "Cancelado", color: "bg-gray-100 text-gray-600" },
}

interface OrdersModalProps {
  user: AdminUser | null
  onClose: () => void
}

export const OrdersModal = ({ user, onClose }: OrdersModalProps) => {
  const { data: payments, isLoading } = useAdminPayment(user?.id ?? null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = payments?.filter(p => statusFilter === "all" || p.status === statusFilter) ?? []

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-4 sm:p-6 max-sm:w-xs">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span className="truncate">Órdenes de {user?.fullName}</span>
          </DialogTitle>
        </DialogHeader>
        <Separator />

        {/* Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600 shrink-0">Filtrar por:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 sm:w-48 h-8 text-xs sm:text-sm">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="approved">Aprobado</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="failed">Fallido</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty — sin órdenes */}
        {!isLoading && payments?.length === 0 && (
          <div className="py-10 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Este usuario no tiene órdenes aún.</p>
          </div>
        )}

        {/* Empty — filtro sin resultados */}
        {!isLoading && payments && payments.length > 0 && filtered.length === 0 && (
          <div className="py-10 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No hay órdenes con este estado.</p>
          </div>
        )}

        {/* List */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((payment) => {
              const st = statusLabel[payment.status] ?? { label: payment.status, color: "bg-gray-100 text-gray-600" }
              return (
                <div key={payment.id} className="rounded-xl border overflow-hidden">

                  {/* Header de la orden */}
                  <div className="px-3 sm:px-4 py-2.5 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 font-medium">
                        Orden:{" "}
                        <span className="font-mono text-gray-700 break-all">
                          {payment.buyOrder}
                        </span>
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex sm:flex-col sm:text-right items-center sm:items-end gap-2 sm:gap-0">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(payment.amount, "CLP")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString("es-CL", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y">
                    {payment.items.map((item) => (
                      <div key={item.id} className="px-3 sm:px-4 py-2.5 flex items-center gap-2.5 sm:gap-3">
                        {/* Imagen */}
                        <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden bg-gray-100">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-800 truncate max-sm:w-[150px]">
                            {item.product?.title ?? (
                              <span className="italic text-gray-400">Producto eliminado</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            Talla: {item.size} · x{item.quantity} · {formatCurrency(item.unitPrice, "CLP")} c/u
                          </p>
                        </div>

                        {/* Subtotal */}
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 shrink-0">
                          {formatCurrency(item.subtotal, "CLP")}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              )
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}