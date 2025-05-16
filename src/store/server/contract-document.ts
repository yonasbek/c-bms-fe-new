import { userRequest } from "../../lib/requests"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AxiosError } from "axios"

// Get all documents for a contract
export const useGetContractDocuments = (contractId: string) => {
  return useQuery({
    queryKey: ["contract-documents", contractId],
    queryFn: async () => {
      const response = await userRequest.get(`/contract-documents/contract/${contractId}`)
      return response.data
    },
    enabled: !!contractId,
  })
}

// Upload documents for a contract
export const useUploadContractDocuments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ contractId, formData }: { contractId: string; formData: FormData }) => {
      const response = await userRequest.post(
        `/contract-documents/upload/${contractId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },
    onSuccess: (_, variables) => {
      toast.success("Documents uploaded successfully")
      queryClient.invalidateQueries({ queryKey: ["contract-documents", variables.contractId] })
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Failed to upload documents:", error)
      toast.error(error.response?.data?.message || "Failed to upload documents")
    },
  })
}

// Delete a contract document
export const useDeleteContractDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await userRequest.delete(`/contract-documents/${documentId}`)
      return response.data
    },
    onSuccess: (_, documentId) => {
      toast.success("Document deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["contract-documents"] })
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Failed to delete document:", error)
      toast.error(error.response?.data?.message || "Failed to delete document")
    },
  })
} 