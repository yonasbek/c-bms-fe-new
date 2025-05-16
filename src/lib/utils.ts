import PaymentType from "../types/payment";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isContractPaid(payments: PaymentType[]) {
  if (!payments || payments.length === 0) return false;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Check if there's a payment that covers the current month
  return payments.some(payment => {
    const paymentFrom = new Date(payment.payment_from);
    const paymentTo = new Date(payment.payment_to);
    
    // Check if the current date falls within the payment period
    // and the payment status is "paid"
    return (
      payment.payment_status === "paid" &&
      today >= paymentFrom &&
      today <= paymentTo
    );
  });
}
