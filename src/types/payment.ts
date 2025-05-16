import ContractType from "./contract";

interface PaymentType {
  id: number;
  created_at: string;
  modified_at: string;
  is_active: boolean;
  reference_number: string;
  payment_status: string;
  payment_from: string;
  payment_to: string;
  payment_date: string;
  file_url?: string;
  contractId: number;
  contract?: ContractType;
}

export default PaymentType; 