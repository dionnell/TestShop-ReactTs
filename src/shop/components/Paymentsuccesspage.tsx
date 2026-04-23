import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useSearchParams } from "react-router"

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
        <p className="text-sm text-gray-500 mb-1">Tu compra fue procesada correctamente.</p>

        {orderId && (
          <p className="text-xs text-gray-400 mt-2 mb-6">
            Orden: <span className="font-mono font-semibold text-gray-600">{orderId}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button asChild size="sm">
            <Link to="/">Seguir comprando</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/profile/user">Ver mi perfil</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}