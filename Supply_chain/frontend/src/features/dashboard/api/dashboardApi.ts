import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../../store';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1/dashboard',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getKpis: builder.query<{ success: boolean, data: { activeShipments: number, pendingWorkflows: number, lowStockAlerts: number, shipmentSuccessRate: number, staleDataWarning: boolean, shipmentTrends: any[], workflowTrends: any[], recentActivity: any[] } }, void>({
      query: () => '/kpis',
    }),
  }),
});

export const { useGetKpisQuery } = dashboardApi;
