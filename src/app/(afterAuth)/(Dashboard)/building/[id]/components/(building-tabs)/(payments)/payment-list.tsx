"use client"

import { FileText, Calendar, DollarSign, Receipt, ExternalLink } from "lucide-react"
import { Badge } from "../../../../../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../../../components/ui/card"
import { useGetAllPayments } from "../../../../../../../../store/server/payment"
import GlobalLoading from "../../../../../../../../components/global-loading"
import { AddPaymentDialog } from "./add-payment-dialog"
import { format } from "date-fns"
import { Button } from "../../../../../../../../components/ui/button"

type PaymentStatus = "paid" | "pending" | "overdue" | "partial"

const paymentStatusColors: Record<PaymentStatus, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  partial: "bg-blue-100 text-blue-800",
}

export function PaymentsList() {
  const { data: payments, isLoading, isError } = useGetAllPayments();

  if (isLoading) return <GlobalLoading title="Payments" />;
  if (isError) return <div>Error loading payments</div>;

  const getFullFileUrl = (partialUrl: string | null) => {
    if (!partialUrl) return null;
    return `${process.env.NEXT_PUBLIC_API_URL}/${partialUrl}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Payments</h2>
        <AddPaymentDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {payments?.data.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Ref: {payment.reference_number}
                  </CardTitle>
                  <CardDescription>
                    {payment.contract?.user?.name || "Unknown Tenant"}
                  </CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className={paymentStatusColors[payment.payment_status as PaymentStatus] || "bg-gray-100 text-gray-800"}
                >
                  {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Payment Period</span>
                    </div>
                    <div className="text-sm">
                      {format(new Date(payment.payment_from), "MMM d, yyyy")} -{" "}
                      {format(new Date(payment.payment_to), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Receipt className="h-4 w-4" />
                      <span>Payment Date</span>
                    </div>
                    <div className="text-sm">
                      {format(new Date(payment.payment_date), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Contract Details</span>
                  </div>
                  <div className="text-sm">
                    {payment.contract ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span>Room:</span>
                          <span className="font-medium">{payment.contract.room?.room_number || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Rent:</span>
                          <span className="font-medium">{payment.contract.monthly_rent} ETB</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No contract information</span>
                    )}
                  </div>
                </div>

                {payment.file_url && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Receipt Document
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(getFullFileUrl(payment.file_url as string) || "", '_blank')}
                      >
                        <FileText className="h-4 w-4" />
                        View Receipt
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {payments?.data.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8 text-muted-foreground">
            No payments found. Add a payment to get started.
          </div>
        )}
      </div>
    </div>
  )
} 