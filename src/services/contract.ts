import axios from "axios"
import { ContractType } from "../types/contract"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const contractService = {
  createContract: async (data: {
    tenant_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    rate_per_sqm: number;
    room_size: number; // We need this to calculate monthly_rent
    monthly_rent: number;
  }) => {
    const response = await axios.post(`${API_URL}/contracts`, data);
    return response.data;
  },

  getContract: async (id: number) => {
    const response = await axios.get(`${API_URL}/contracts/${id}`);
    return response.data;
  },

  getContractsForTenant: async (tenantId: number) => {
    const response = await axios.get(`${API_URL}/contracts/tenant/${tenantId}`);
    return response.data;
  },

  updateContract: async (id: number, data: Partial<ContractType>) => {
    const response = await axios.patch(`${API_URL}/contracts/${id}`, data);
    return response.data;
  },

  deleteContract: async (id: number) => {
    const response = await axios.delete(`${API_URL}/contracts/${id}`);
    return response.data;
  },

  uploadContractDocuments: async (contractId: number, formData: FormData) => {
    const response = await axios.post(
      `${API_URL}/contract-documents/upload/${contractId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
}; 