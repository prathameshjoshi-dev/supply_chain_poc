import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../../store';

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1/ai',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AiHistory'],
  endpoints: (builder) => ({
    getHistory: builder.query<{ status: string, data: any[] }, string>({
      query: (userId) => `/history?userId=${userId}`,
      providesTags: ['AiHistory'],
    }),
    sendMessage: builder.mutation<{ status: string, data: { response: string } }, { userId: string, message: string }>({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AiHistory'],
    }),
  }),
});

export const { useSendMessageMutation, useGetHistoryQuery } = aiApi;
