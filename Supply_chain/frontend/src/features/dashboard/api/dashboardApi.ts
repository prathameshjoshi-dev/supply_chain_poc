import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/dashboard' }),
  endpoints: (builder) => ({
    getKpis: builder.query<{ success: boolean, data: { activeShipments: number, pendingWorkflows: number, lowStockAlerts: number, shipmentSuccessRate: number, staleDataWarning: boolean, shipmentTrends: any[], workflowTrends: any[], recentActivity: any[] } }, void>({
      query: () => '/kpis',
    }),
  }),
});

export const { useGetKpisQuery } = dashboardApi;
