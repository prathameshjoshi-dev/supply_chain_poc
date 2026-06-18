import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../../store';

export interface ScheduledReport {
  _id: string;
  name: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
  status: string;
}

export interface ReportDownload {
  _id: string;
  name: string;
  type: string;
  generatedAt: string;
  size: string;
}

export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reports'],
  endpoints: (builder) => ({
    getScheduledReports: builder.query<{success: boolean, data: ScheduledReport[]}, void>({
      query: () => '/reports/scheduled',
      providesTags: ['Reports']
    }),
    getRecentDownloads: builder.query<{success: boolean, data: ReportDownload[]}, void>({
      query: () => '/reports/downloads',
      providesTags: ['Reports']
    }),
    generateReport: builder.mutation<{success: boolean, data: ReportDownload}, { format: string, dateRange: string, warehouses: string[] }>({
      query: (body) => ({
        url: '/reports/generate',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Reports']
    }),
    clearRecentDownloads: builder.mutation<{success: boolean}, void>({
      query: () => ({
        url: '/reports/downloads',
        method: 'DELETE'
      }),
      invalidatesTags: ['Reports']
    })
  })
});

export const {
  useGetScheduledReportsQuery,
  useGetRecentDownloadsQuery,
  useGenerateReportMutation,
  useClearRecentDownloadsMutation
} = reportsApi;
