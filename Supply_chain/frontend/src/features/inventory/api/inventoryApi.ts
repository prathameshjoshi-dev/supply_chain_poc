import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface InventoryItem {
  _id: string;
  sku: string;
  description: string;
  warehouse: string;
  currentQty: number;
  safetyStock: number;
  status: 'In Stock' | 'Low Stock' | 'Stockout';
  leadTime: number;
  reorderPoint: number;
  demandForecast: number[];
}

export interface InventoryResponse {
  success: boolean;
  data: InventoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InventoryKpiResponse {
  success: boolean;
  data: {
    totalSkus: number;
    lowStockItems: number;
    excessStock: number;
  };
}

interface GetInventoryArgs {
  page?: number;
  limit?: number;
  search?: string;
}

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Inventory', 'InventoryKpi'],
  endpoints: (builder) => ({
    getInventory: builder.query<InventoryResponse, GetInventoryArgs>({
      query: (args) => {
        const { page = 1, limit = 10, search } = args;
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);

        return {
          url: `/inventory?${params.toString()}`,
        };
      },
      providesTags: ['Inventory'],
    }),
    getInventoryKpis: builder.query<InventoryKpiResponse, void>({
      query: () => '/inventory/kpis',
      providesTags: ['InventoryKpi']
    }),
    initiateRestock: builder.mutation<{success: boolean, data: InventoryItem}, string>({
      query: (sku) => ({
        url: `/inventory/${sku}/restock`,
        method: 'POST'
      }),
      invalidatesTags: ['Inventory', 'InventoryKpi']
    })
  }),
});

export const { useGetInventoryQuery, useGetInventoryKpisQuery, useInitiateRestockMutation } = inventoryApi;
