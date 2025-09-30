"use client"

import { useState } from "react"
import { Download, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Badge } from "@/Components/ui/badge"
// import { useToast } from "@/hooks/use-toast"
import type { Table as TableType } from "@/lib/types"
import Image from "next/image"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  table: TableType
}

export function QRCodeModal({ isOpen, onClose, table }: QRCodeModalProps) {
  // const { toast } = useToast()
  const [qrSize, setQrSize] = useState(256)

  // Generate the menu URL with table parameter
  const menuUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/menu?table=${table.number}`

  // Generate QR code URL using a QR code service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(menuUrl)}&format=png&margin=10`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // toast({
    //   title: "Copied to clipboard",
    //   description: "The URL has been copied to your clipboard.",
    // })
  }

  const downloadQRCode = () => {
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `table-${table.number}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // toast({
    //   title: "QR Code Downloaded",
    //   description: `QR code for Table ${table.number} has been downloaded.`,
    // })
  }

  const openMenuPreview = () => {
    window.open(menuUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            QR Code - Table {table.number}
            <Badge variant={table.active ? "default" : "secondary"}>{table.active ? "Active" : "Inactive"}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-center">Scan to Order</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <Image
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt={`QR Code for Table ${table.number}`}
                  className="w-64 h-64"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">Table {table.number}</p>
                <p className="text-xs text-gray-500">Capacity: {table.capacity} people</p>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">QR Code Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-size">QR Code Size</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="qr-size"
                    type="range"
                    min="128"
                    max="512"
                    step="64"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">{qrSize}px</span>
                </div>
              </div>

              <div>
                <Label htmlFor="menu-url">Menu URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input id="menu-url" value={menuUrl} readOnly className="flex-1 bg-gray-50" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(menuUrl)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={downloadQRCode} className="flex items-center gap-2 flex-1">
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
            <Button
              onClick={openMenuPreview}
              variant="outline"
              className="flex items-center gap-2 flex-1 bg-transparent"
            >
              <ExternalLink className="h-4 w-4" />
              Preview Menu
            </Button>
          </div>

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Print the QR code and place it on Table {table.number}</li>
                <li>• Customers scan the code to access the menu</li>
                <li>• Orders are automatically linked to this table</li>
                <li>• Deactivate the QR code when the table is not in use</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
