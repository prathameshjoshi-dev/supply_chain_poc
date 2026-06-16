import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../../store';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  warehouseScope?: string;
  avatar?: string;
  lastActivity?: string;
}

export interface GetUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserInsights {
  totalCapacity: number;
  adminAccounts: number;
  activePercentage: number;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/users',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Insights'],
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, { page?: number; limit?: number; search?: string; role?: string; warehouseScope?: string }>({
      query: (params) => {
        const queryStr = new URLSearchParams();
        if (params.page) queryStr.append('page', params.page.toString());
        if (params.limit) queryStr.append('limit', params.limit.toString());
        if (params.search) queryStr.append('search', params.search);
        if (params.role) queryStr.append('role', params.role);
        if (params.warehouseScope) queryStr.append('warehouseScope', params.warehouseScope);
        return `?${queryStr.toString()}`;
      },
      providesTags: ['User'],
    }),
    getInsights: builder.query<UserInsights, void>({
      query: () => '/insights',
      providesTags: ['Insights'],
    }),
    bulkAction: builder.mutation<{ modifiedCount: number }, { userIds: string[]; action: 'delete' | 'suspend' }>({
      query: (body) => ({
        url: '/bulk-action',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Insights'],
    }),
    createUser: builder.mutation<{ user: User }, any>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Insights'],
    }),
    updateUser: builder.mutation<{ user: User }, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User', 'Insights'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetInsightsQuery,
  useBulkActionMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi;
