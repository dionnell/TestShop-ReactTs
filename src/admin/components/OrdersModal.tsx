import type { AdminUser } from "../action/getUsers.action"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, ShoppingBag } from "lucide-react"
import { formatCurrency } from "@/lib/currency-formatter"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminPayment } from "../hooks/useAdminPayment"

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

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-2xl max-h-11/12 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Órdenes de {user?.fullName}
          </DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3 mt-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && payments?.length === 0 && (
          <div className="py-10 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Este usuario no tiene órdenes aún.</p>
          </div>
        )}

        {/* List */}
        {!isLoading && payments && payments.length > 0 && (
          <div className="space-y-4 mt-2">
            {payments.map((payment) => {
              const st = statusLabel[payment.status] ?? {
                label: payment.status,
                color: "bg-gray-100 text-gray-600",
              }
              return (
                <div key={payment.id} className="rounded-xl border overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-medium">
                        Orden:{" "}
                        <span className="font-mono text-gray-700">{payment.buyOrder}</span>
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(payment.amount, "CLP")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString("es-CL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y">
                    {payment.items.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 flex items-center gap-3"
                      >
                        {/* Image */}
                        <div className="shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
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
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.product?.title ?? (
                              <span className="italic text-gray-400">Producto eliminado</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400">
                            Talla: {item.size} · x{item.quantity} · {formatCurrency(item.unitPrice, "CLP")} c/u
                          </p>
                        </div>

                        {/* Subtotal */}
                        <p className="text-sm font-semibold text-gray-900 shrink-0">
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
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}