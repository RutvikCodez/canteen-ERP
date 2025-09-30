"use client"

import { useState, useEffect } from "react"
import { Check, Clock } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Card, CardContent } from "@/Components/ui/card"
import { useCartStore } from "@/lib/cart-store"
import { PaymentModal } from "./payment-modal"

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  orderTotal: number
}

export function OrderConfirmationModal({ isOpen, onClose, orderTotal }: OrderConfirmationModalProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [estimatedTime, setEstimatedTime] = useState(25)
  const [transactionId, setTransactionId] = useState("")
  const { clearCart } = useCartStore()

  useEffect(() => {
    if (isOpen && !paymentComplete) {
      setShowPayment(true)
    }
  }, [isOpen, paymentComplete])

  const handlePaymentSuccess = (paymentMethod: string, txnId: string) => {
    // Generate order ID
    const id = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    setOrderId(id)
    setTransactionId(txnId)

    // Random estimated time between 15-35 minutes
    setEstimatedTime(Math.floor(Math.random() * 20) + 15)

    setShowPayment(false)
    setPaymentComplete(true)
  }

  const handleClose = () => {
    if (paymentComplete) {
      clearCart()
    }
    setPaymentComplete(false)
    setShowPayment(false)
    onClose()
  }

  return (
    <>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        orderTotal={orderTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Order Confirmation */}
      <Dialog open={isOpen && paymentComplete} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Order Confirmed!</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Success Animation */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-fade-in">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>

            {/* Order Details */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Order ID</span>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{orderId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Transaction ID</span>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{transactionId}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-semibold text-lg">${orderTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Estimated Time
                  </span>
                  <span className="font-semibold text-primary">{estimatedTime} minutes</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>Payment successful! Your order has been sent to the kitchen.</p>
              <p>We&apos;ll prepare it fresh for you!</p>
            </div>

            <Button onClick={handleClose} className="w-full" size="lg">
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
