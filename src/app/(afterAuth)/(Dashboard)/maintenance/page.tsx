import type { Metadata } from "next"
import { MaintenanceList } from "../building/[id]/components/(building-tabs)/(maintenance)/maintenance-list"
export const metadata: Metadata = {
  title: "Tenants Management",
  description: "Manage building tenants",
}

export default function SubContractsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tenants Management</h2>
      </div>
      <div className="space-y-4">
        <MaintenanceList />
      </div>
    </div>
  )
}

