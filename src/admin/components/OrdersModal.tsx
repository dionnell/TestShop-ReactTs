import { useState } from "react"
import type { AdminUser } from "../action/getUsers.action"
import { testShopApi } from "@/api/testShopApi"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, ShoppingBag } from "lucide-react"
import { formatCurrency } from "@/lib/currency-formatter"
import { Button } from "@/components/ui/button"

interface PaymentItem {
  id: string
  size: string
  quantity: number
  subtotal: number
  product: { title: string; slug: string } | null
}

interface Payment {
  id: string
  buyOrder: string
  amount: number
  status: string
  createdAt: string
  items: PaymentItem[]
}

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
  const [payments, setPayments] = useState<Payment[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (!user || payments !== null) return
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await testShopApi.get<Payment[]>(`/payments/user/${user.id}/payments`)
      setPayments(data)
    } catch {
      setPayments([])
      setError(null) // empty state is fine
    } finally {
      setIsLoading(false)
    }
  }

  // fetch on first open
  if (user && payments === null && !isLoading && !error) {
    fetchOrders()
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) { onClose(); setPayments(null) } }}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Órdenes de {user?.fullName}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {!isLoading && payments?.length === 0 && (
          <div className="py-10 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Este usuario no tiene órdenes aún.</p>
          </div>
        )}

        {!isLoading && payments && payments.length > 0 && (
          <div className="space-y-4 mt-2">
            {payments.map((payment) => {
              const st = statusLabel[payment.status] ?? { label: payment.status, color: "bg-gray-100 text-gray-600" }
              return (
                <div key={payment.id} className="rounded-xl border overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-medium">
                        Orden: <span className="font-mono text-gray-700">{payment.buyOrder}</span>
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount, 'CLP')}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString("es-CL", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {/* Items */}
                  <div className="divide-y">
                    {payment.items.map((item) => (
                      <div key={item.id} className="px-4 py-2 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.product?.title ?? <span className="italic text-gray-400">Producto eliminado</span>}
                          </p>
                          <p className="text-xs text-gray-400">Talla: {item.size} · x{item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal, 'CLP')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => { onClose(); setPayments(null) }}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
