"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Wallet } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Label } from "@/Components/ui/label"
import { Input } from "@/Components/ui/input"
import { Badge } from "@/Components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { Separator } from "@radix-ui/react-separator"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderTotal: number
  onPaymentSuccess: (paymentMethod: string, transactionId: string) => void
}

const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express",
    logos: ["💳", "🏦"],
  },
  {
    id: "upi",
    name: "UPI",
    icon: Smartphone,
    description: "Google Pay, PhonePe, Paytm, BHIM",
    logos: ["📱", "💰"],
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: Wallet,
    description: "Paytm, Amazon Pay, Mobikwik",
    logos: ["👛", "💸"],
  },
]

export function PaymentModal({ isOpen, onClose, orderTotal, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [upiId, setUpiId] = useState("")

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock transaction ID
    const transactionId = `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    setIsProcessing(false)
    onPaymentSuccess(selectedMethod, transactionId)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Complete Payment
            <Badge variant="outline" className="text-lg font-semibold">
              ${orderTotal.toFixed(2)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Select Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="mt-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <div key={method.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      <Card
                        className={`border-2 ${selectedMethod === method.id ? "border-primary" : "border-gray-200"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.description}</div>
                            </div>
                            <div className="flex gap-1">
                              {method.logos.map((logo, index) => (
                                <span key={index} className="text-lg">
                                  {logo}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Payment Details Form */}
          <div className="space-y-4">
            {selectedMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedMethod === "upi" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UPI Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      You will be redirected to your UPI app to complete the payment of ${orderTotal.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedMethod === "wallet" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Digital Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      You will be redirected to your selected wallet app to complete the payment of $
                      {orderTotal.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payment Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-xl font-bold text-primary">${orderTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Button */}
          <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
            {isProcessing ? "Processing Payment..." : `Pay $${orderTotal.toFixed(2)}`}
          </Button>

          <div className="text-center text-xs text-gray-500">
            <p>🔒 Your payment information is secure and encrypted</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
