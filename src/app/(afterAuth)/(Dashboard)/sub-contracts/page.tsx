import type { Metadata } from "next"
import { SubContractList } from "./components/sub-contract-list"

export const metadata: Metadata = {
  title: "Sub-Contracts Management",
  description: "Manage building sub-contractors and service providers",
}

export default function SubContractsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sub-Contracts Management</h2>
      </div>
      <div className="space-y-4">
        <SubContractList />
      </div>
    </div>
  )
}

