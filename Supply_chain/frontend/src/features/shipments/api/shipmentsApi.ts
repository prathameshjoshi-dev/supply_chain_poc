import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Shipment {
  _id: string;
  shipmentId: string;
  status: string;
  eta: string;
  origin: string;
  destination: string;
  carrier: string;
  lastUpdate: string;
}

export interface ShipmentsResponse {
  success: boolean;
  data: Shipment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface GetShipmentsArgs {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  carrier?: string;
  startDate?: string;
  endDate?: string;
}

export const shipmentsApi = createApi({
  reducerPath: 'shipmentsApi',
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
  tagTypes: ['Shipment'],
  endpoints: (builder) => ({
    getShipments: builder.query<ShipmentsResponse, GetShipmentsArgs>({
      query: (args) => {
        const { page = 1, limit = 10, search, status, carrier, startDate, endDate } = args;
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (search) params.append('search', search);
        if (status && status !== 'All Statuses') params.append('status', status);
        if (carrier && carrier !== 'All Carriers') params.append('carrier', carrier);
        if (startDate && endDate) {
          params.append('startDate', startDate);
          params.append('endDate', endDate);
        }

        return {
          url: `/shipments?${params.toString()}`,
        };
      },
      providesTags: ['Shipment'],
    }),
    createShipment: builder.mutation<any, any>({
      query: (body) => ({
        url: '/shipments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Shipment'],
    }),
  }),
});

export const { useGetShipmentsQuery, useCreateShipmentMutation } = shipmentsApi;
