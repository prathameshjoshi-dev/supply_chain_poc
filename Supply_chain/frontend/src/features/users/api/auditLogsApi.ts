import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../../store';

export interface AuditLogUser {
  id: string;
  initials: string;
  name: string;
  colorClass: string;
}

export interface AuditLog {
  _id: string;
  timestamp: string;
  user: AuditLogUser;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'AUTH';
  entity: string;
  entityId: string;
  sourceIp: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
}

export interface AuditLogStats {
  totalEvents: number;
  criticalActions: number;
  authFailures: number;
  uptime: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  stats: AuditLogStats;
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  dateRange?: string;
  user?: string;
  action?: string;
  entity?: string;
}

export const auditLogsApi = createApi({
  reducerPath: 'auditLogsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/audit-logs',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AuditLog'],
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogsResponse, GetAuditLogsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.dateRange) queryParams.append('dateRange', params.dateRange);
        if (params.user) queryParams.append('user', params.user);
        if (params.action) queryParams.append('action', params.action);
        if (params.entity) queryParams.append('entity', params.entity);

        return {
          url: `/?${queryParams.toString()}`,
        };
      },
      providesTags: ['AuditLog'],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
} = auditLogsApi;
