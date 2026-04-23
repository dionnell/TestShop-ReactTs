import { useState } from "react"
import { ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createPaymentAction } from "../actions/createPayment.action"

interface Props {
  disabled?: boolean
}

export const CheckoutButton = ({ disabled }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      const { url, token } = await createPaymentAction()

      // Transbank requiere un POST con token_ws — no una redirección simple
      const form = document.createElement("form")
      form.method = "POST"
      form.action = url

      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "token_ws"
      input.value = token

      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
    } catch (error: any) {
      setIsLoading(false)
      toast.error(
        error?.response?.data?.message ?? "No se pudo iniciar el pago. Intenta de nuevo.",
        { position: "top-right", richColors: true }
      )
    }
  }

  return (
    <Button
      className="w-full rounded-xl h-11 text-sm"
      disabled={disabled || isLoading}
      onClick={handleCheckout}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Redirigiendo a Webpay...
        </>
      ) : (
        <>
          Ir a pagar
          <ChevronRight className="h-4 w-4 ml-1" />
        </>
      )}
    </Button>
  )
}