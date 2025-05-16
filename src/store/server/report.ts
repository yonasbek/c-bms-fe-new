//mutiate floor create 
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "../../lib/requests";
import { MaintenanceType } from "../../types/maintainance";



export const useGetReportForBuilding = (buildingId: string) => {
  return useQuery({ 
    queryKey: ['report', buildingId],
    queryFn: () => userRequest.get<MaintenanceType[]>(`/Reports/building_report/${buildingId}`),
  });
};



export const getReportForBuilding = (buildingId: string) => {
  const reportQuery = useGetReportForBuilding(buildingId);
  const report = reportQuery.data?.data as any;
  


  const isLoading = reportQuery.isLoading;
  const isError = reportQuery.isError;
  const error = reportQuery.error;



  return {
    data: report,
    isLoading,
    isError,
    error,
    refetch: async () => {
      await reportQuery.refetch();
    }
  };
};








