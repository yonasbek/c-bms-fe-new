import { userRequest } from "../../lib/requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import PaymentType from "../../types/payment";

interface CreatePaymentData {
  reference_number: string;
  payment_status: string;
  payment_from: string;
  payment_to: string;
  payment_date: string;
  file_url?: string;
  contractId: string;
}

export const useGetPaymentsForContract = (contractId: number) => {
  return useQuery({
    queryKey: ["contract-payments", contractId],
    queryFn: () => userRequest.get<PaymentType[]>(
      `/payment/search/contractId/${contractId}`
    ),
    enabled: !!contractId,
  });
};

export const useGetAllPayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => userRequest.get<PaymentType[]>("/payment"),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentData) => 
      userRequest.post<PaymentType>("/payment", data),
    onSuccess: (_, variables) => {
      toast.success("Payment added successfully");
      queryClient.invalidateQueries({ queryKey: ["contract-payments", variables.contractId] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add payment: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePaymentData> }) => 
      userRequest.patch<PaymentType>(`/payment/${id}`, data),
    onSuccess: (_, variables) => {
      toast.success("Payment updated successfully");
      if (variables.data.contractId) {
        queryClient.invalidateQueries({ queryKey: ["contract-payments", variables.data.contractId] });
      }
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update payment: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contractId }: { id: number; contractId: number }) => 
      userRequest.delete<void>(`/payment/${id}`),
    onSuccess: (_, variables) => {
      toast.success("Payment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contract-payments", variables.contractId] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete payment: ${error.response?.data?.message || error.message}`);
    },
  });
}; 