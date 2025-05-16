export type ContractStatus = "active" | "expired" | "terminated"
export type ServiceType = "security" | "cleaning" | "maintenance" | "landscaping" | "other"

export interface SubContractType {
  id: string
  company_name: string
  service_type: ServiceType
  start_date: string
  end_date: string
  status: ContractStatus
  amount: string
  number_of_employees: string
  buildingId: string
  created_at: string
  updated_at: string
  contact_name: string
  contact_phone: string
  contact_email: string
  service_days: string
  service_hours: string
  building: {
    id: string
    name: string
  }
}
export interface CreateSubContractType {
  company_name: string
  service_type: ServiceType
  start_date: string
  end_date: string
  amount: string
  number_of_employees: string
  buildingId: string
  contact_name: string
  contact_phone: string
  contact_email: string
  service_days: string
  service_hours: string
}
