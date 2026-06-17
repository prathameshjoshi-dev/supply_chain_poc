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
import { aiApi } from '../features/ai/api/aiApi';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';
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
    [aiApi.reducerPath]: aiApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
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
      reportsApi.middleware,
      aiApi.middleware,
      dashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
