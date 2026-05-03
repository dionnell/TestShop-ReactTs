import { AdminTitle } from "@/admin/components/AdminTitle"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/currency-formatter"
import { useAllOrders } from "@/admin/hooks/useAdminPayment"
import { Package, Filter } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { AdminPayment } from "@/admin/action/getOrdersByUser.action"
import { OrderDetailModal } from "@/admin/components/OrderDetailModal"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { useSearchParams } from "react-router"


const statusLabel: Record<string, { label: string; color: string }> = {
  approved: { label: "Aprobado",  color: "bg-green-100 text-green-700" },
  pending:  { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
  failed:   { label: "Fallido",   color: "bg-red-100 text-red-700" },
  cancelled:{ label: "Cancelado", color: "bg-gray-100 text-gray-600" },
}

export const AdminOrdersPage = () => {

  const [searchParams, setSearchParams,] = useSearchParams()

  const { data: payments, isLoading, isError } = useAllOrders()
  const [selected, setSelected] = useState<AdminPayment | null>(null)
  const currentStatus = searchParams.get("status") || "all"

  const statuses = [
    {id: "all", label: "Todos", color: "bg-gray-100 text-gray-600"},
    {id: "approved", label: "Aprobado", color: "bg-green-100 text-green-700"},
    {id: "pending", label: "Pendiente", color: "bg-yellow-100 text-yellow-700"},
    {id: "failed", label: "Fallido", color: "bg-red-100 text-red-700"},
    {id: "cancelled", label: "Cancelado", color: "bg-gray-100 text-gray-600"}
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
  

  if (isLoading) return <CustomFullScreenLoading />

  if (isError || !payments) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudieron cargar las órdenes. Intenta de nuevo.
      </div>
    )
  }

  if (payments.payments.length === 0) {
    return (
      <div className="p-6 text-center text-red-500">
            No hay órdenes para mostrar.
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
        {statuses.map((status) => {
          const count = status.id === "all"
            ? payments.payments.length
            : payments.payments.filter((p) => p.status === status.id).length
          return (
            <Button
              key={status.id}
              variant={currentStatus === status.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange(status.id)}
              className={`${currentStatus === status.id ? status.color : ""}`}
            >
              {status.label} ({count})
            </Button>
          )
        })}
      </div>

      <Table className="bg-white shadow-xs border-2 border-gray-200 mb-10">
        <TableHeader>
          <TableRow>
            <TableHead>Orden</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-center">Detalle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No hay órdenes con ese estado.
              </TableCell>
            </TableRow>
          ) : (
            payments.payments.map((payment) => {
            const st = statusLabel[payment.status] ?? {
              label: payment.status,
              color: "bg-gray-100 text-gray-600",
            }
            return (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-xs text-gray-700">
                  {payment.buyOrder}
                </TableCell>

                {/* Usuario */}
                <TableCell>
                  <div className="flex items-center gap-2">
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

                {/* Productos */}
                <TableCell>
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

                <TableCell className="font-semibold text-gray-900">
                  {formatCurrency(payment.amount, "CLP")}
                </TableCell>

                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>
                    {st.label}
                  </span>
                </TableCell>

                <TableCell className="text-xs text-gray-500">
                  {new Date(payment.createdAt).toLocaleDateString("es-CL", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => setSelected(payment)}
                  >
                    Ver detalle
                  </Button>
                </TableCell>
              </TableRow>
            )
          }))}
        </TableBody>
      </Table>
      <CustomPagination
              totalPages={payments?.pages || 0}
        />

      <OrderDetailModal payment={selected} onClose={() => setSelected(null)} />
    </>
  )
}