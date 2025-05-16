import type { Metadata } from "next"
import { ContractsList } from "../building/[id]/components/(building-tabs)/(contracts)/contracts-list"
export const metadata: Metadata = {
  title: "Contracts Management",
  description: "Manage building contracts",
}

export default function SubContractsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tenants Management</h2>
      </div>
      <div className="space-y-4">
        <ContractsList />
      </div>
    </div>
  )
}

