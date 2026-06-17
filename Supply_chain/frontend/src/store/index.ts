import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/api/authApi';
import { usersApi } from '../features/users/api/usersApi';
import { rolesApi } from '../features/users/api/rolesApi';
import { auditLogsApi } from '../features/users/api/auditLogsApi';
import { notificationsApi } from '../features/notifications/api/notificationsApi';
import { shipmentsApi } from '../features/shipments/api/shipmentsApi';
import { inventoryApi } from '../features/inventory/api/inventoryApi';
import { workflowsApi } from '../features/workflows/api/workflowsApi';
import { reportsApi } from '../features/reports/api/reportsApi';
import authReducer from '../features/auth/slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [auditLogsApi.reducerPath]: auditLogsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [shipmentsApi.reducerPath]: shipmentsApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [workflowsApi.reducerPath]: workflowsApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      usersApi.middleware, 
      rolesApi.middleware,
      auditLogsApi.middleware,
      notificationsApi.middleware,
      shipmentsApi.middleware,
      inventoryApi.middleware,
      workflowsApi.middleware,
      reportsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
