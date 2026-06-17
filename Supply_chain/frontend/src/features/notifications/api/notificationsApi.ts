import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface NotificationAction {
  label: string;
  actionType: string;
  actionVariant: string;
  payload?: any;
}

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  category: string;
  entityId: string;
  read: boolean;
  actions: NotificationAction[];
  timestamp: string;
  createdAt: string;
}

export interface NotificationPreferences {
  userId: string;
  inAppPush: boolean;
  emailDigests: boolean;
  smsAlerts: boolean;
}

export interface NotificationsResponse {
  data: AppNotification[];
  total: number;
  page: number;
  limit: number;
  stats: {
    total: number;
    critical: number;
    warning: number;
    info: number;
  };
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1/notifications',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notification', 'NotificationPreferences'],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, any>({
      query: (params) => ({
        url: '',
        params,
      }),
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<AppNotification, string>({
      query: (id) => ({
        url: `/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<{ updatedCount: number }, void>({
      query: () => ({
        url: '/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    getPreferences: builder.query<NotificationPreferences, string>({
      query: (userId) => `/preferences?userId=${userId}`,
      providesTags: ['NotificationPreferences'],
    }),
    updatePreferences: builder.mutation<NotificationPreferences, Partial<NotificationPreferences>>({
      query: (data) => ({
        url: '/preferences',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['NotificationPreferences'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} = notificationsApi;
