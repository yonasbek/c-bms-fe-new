"use client"

import { FileText, MoreVertical, Calendar, DollarSign, ExternalLink, Ruler, Upload } from "lucide-react"
import { Button } from "../../../../../../../../components/ui/button"
import { Badge } from "../../../../../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../../../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../../../../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../../../components/ui/dialog"
import { Input } from "../../../../../../../../components/ui/input"
import { useBuildingStore } from "../../../../../../../../store/buildings"
import GlobalLoading from "../../../../../../../../components/global-loading"
import { AddContractDialog } from "./add-contract-dialog"
import { useGetBuildingContractsByStatusAndPayment } from "../../../../../../../../store/server/contract"
import { useGetContractDocuments, useUploadContractDocuments } from "../../../../../../../../store/server/contract-document"
import ContractType from "../../../../../../../../types/contract"
import PaymentType from "../../../../../../../../types/payment"
import { isContractPaid } from "../../../../../../../../lib/utils"
import { TerminateContractDialog } from "./terminate-contract-dialog"
import { useState } from "react"
import { toast } from "sonner"
import { ContractDocument } from "../../../../../../../../types/contract"
import { useQueryClient } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../components/ui/select"

const contractStatusColors = {
  active: "bg-green-100 text-green-800",
  terminated: "bg-red-800 text-white",
  expired: "bg-yellow-100 text-yellow-800",
}

function UploadDocumentsDialog({ contractId }: { contractId: number }) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)
  const { mutate: uploadDocuments, isPending: isUploading } = useUploadContractDocuments()
  const queryClient = useQueryClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files)
    }
  }

  const handleUpload = () => {
    if (!files || files.length === 0) {
      toast.error("Please select at least one file")
      return
    }

    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('files', file)
    })

    uploadDocuments(
      { contractId: contractId.toString(), formData },
      {
        onSuccess: () => {
          setOpen(false)
          setFiles(null)
          queryClient.invalidateQueries({ queryKey: ["contract-documents", contractId.toString()] })
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Documents
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Contract Documents</DialogTitle>
          <DialogDescription>
            Select multiple documents to upload for this contract.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !files}>
              {isUploading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ContractsList() {
  const { activeBuilding } = useBuildingStore();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'terminated'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const { data: contracts, isLoading, isError } = useGetBuildingContractsByStatusAndPayment(
    activeBuilding?.id?.toString() || "",
    statusFilter,
    paymentFilter
  );

  if (isLoading) return <GlobalLoading title="Contracts"/>;
  if (isError) return <div>Error loading contracts</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contracts</h2>
        <div className="flex gap-4 items-center">
          <Select value={statusFilter} onValueChange={value => setStatusFilter(value as 'all' | 'active' | 'terminated')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={value => setPaymentFilter(value as 'all' | 'paid' | 'unpaid')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
          <AddContractDialog />
        </div>
      </div>

      {contracts && contracts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract: ContractType & {payments: PaymentType[]}) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Contracts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by creating a new contract.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ContractCard({ contract }: any) {
  const { data: documents, isLoading: isLoadingDocuments } = useGetContractDocuments(contract.id.toString())
  
  // Debug logs
 

  const getFullFileUrl = (documentUrl: string): string => {
    // Debug log for URL construction
   
    const normalizedUrl = documentUrl.replace(/\\/g, '/')
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/${normalizedUrl}`
    return fullUrl
  }

  return (
    <Card className="relative overflow-hidden">
      {contract.contract_status === "terminated" && (
        <>
          <div className="absolute inset-0 bg-white/80 z-10" />
          <div 
            className="absolute -right-14 top-8 w-[200px] text-center z-20 rotate-45 transform bg-red-600 py-2 text-sm font-bold text-white shadow-sm"
          >
            TERMINATED
          </div>
        </>
      )}
      <div className={contract.contract_status === "terminated" ? "opacity-80" : ""}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {contract.user?.name}
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Room {contract.room?.room_number}
                </Badge>
              </CardTitle>
              <CardDescription></CardDescription>
            </div>
            <div className="flex items-center gap-1">
            {isContractPaid(contract.payments) ? (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Paid
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-100 text-red-800">
                Unpaid
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <TerminateContractDialog 
                  contractId={Number(contract.id)} 
                  contractName={`${contract.user?.name}'s contract`} 
                />
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent> 
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Period</span>
              </div>
              <div className="text-sm">
                {new Date(contract.start_date).toLocaleDateString()} -{" "}
                {new Date(contract.end_date).toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Rate per m²
                  </span>
                </div>
                <span className="font-medium">
                  {contract.rate_per_sqm?.toFixed(2) || "0.00"} ETB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Room Size
                  </span>
                </div>
                <span className="font-medium">
                  {contract.room?.room_size || 0}m²
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Monthly Rent
                  </span>
                </div>
                <span className="font-medium">
                  {contract.monthly_rent?.toFixed(2) || "0.00"} ETB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Quarterly Rent
                  </span>
                </div>
                <span className="font-medium">
                  {((contract.monthly_rent || 0) * 3).toFixed(2)} ETB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Status
                </span>
                <Badge
                  variant="outline"
                  className={
                    contractStatusColors[
                      contract.contract_status as keyof typeof contractStatusColors
                    ]
                  }
                >
                  {contract.contract_status.charAt(0).toUpperCase() + contract.contract_status.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Documents
                </span>
                <UploadDocumentsDialog contractId={Number(contract.id)} />
              </div>
              {isLoadingDocuments ? (
                <div className="text-sm text-muted-foreground">Loading documents...</div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc: ContractDocument) => {
                    // Debug log for each document
                    return (
                      <Button
                        key={doc.id}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 w-full justify-start"
                        onClick={() => {
                          const url = getFullFileUrl(doc.document_url)
                          window.open(url, '_blank')
                        }}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{doc.document_name}</span>
                        <ExternalLink className="h-3 w-3 ml-auto flex-shrink-0" />
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No documents uploaded yet
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
} 