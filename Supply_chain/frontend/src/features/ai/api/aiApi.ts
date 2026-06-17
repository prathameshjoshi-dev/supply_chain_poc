import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/ai' }),
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
