import { ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePayment } from "@/shop/hooks/usePayment"

interface Props {
  disabled?: boolean
}

export const CheckoutButton = ({ disabled }: Props) => {
  const { initiatePayment, isLoading } = usePayment()

  return (
    <Button
      className="w-full rounded-xl h-11 text-sm"
      disabled={disabled || isLoading}
      onClick={initiatePayment}
    >
      {isLoading ? (
        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirigiendo a Webpay...</>
      ) : (
        <>Ir a pagar <ChevronRight className="h-4 w-4 ml-1" /></>
      )}
    </Button>
  )
}