import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AuditTrailEntry {
  timestamp: string;
  user: string;
  message: string;
  isCritical: boolean;
}

export interface WorkflowTask {
  _id: string;
  taskId: string;
  priority: 'Critical Priority' | 'High Priority' | 'Standard';
  title: string;
  dueAt: string;
  category: string;
  assignees: string[];
  status: 'Open' | 'In-Progress' | 'Resolved' | 'Escalated';
  summary: string;
  progress: number;
  auditTrail: AuditTrailEntry[];
  notes: string;
}

export interface WorkflowsResponse {
  success: boolean;
  data: WorkflowTask[];
}

export interface CreateWorkflowDto {
  category: string;
  priority: string;
  assignee?: string;
  relatedEntityId?: string;
  dueAt: string;
  notes?: string;
}

export const workflowsApi = createApi({
  reducerPath: 'workflowsApi',
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
  tagTypes: ['Workflows'],
  endpoints: (builder) => ({
    getWorkflows: builder.query<WorkflowsResponse, { status?: string }>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.status) params.append('status', args.status);
        return {
          url: `/workflows?${params.toString()}`,
        };
      },
      providesTags: ['Workflows'],
    }),
    escalateWorkflow: builder.mutation<{success: boolean, data: WorkflowTask}, string>({
      query: (taskId) => ({
        url: `/workflows/${taskId}/escalate`,
        method: 'POST'
      }),
      invalidatesTags: ['Workflows']
    }),
    pauseWorkflow: builder.mutation<{success: boolean, data: WorkflowTask}, string>({
      query: (taskId) => ({
        url: `/workflows/${taskId}/pause`,
        method: 'POST'
      }),
      invalidatesTags: ['Workflows']
    }),
    completeWorkflow: builder.mutation<{success: boolean, data: WorkflowTask}, string>({
      query: (taskId) => ({
        url: `/workflows/${taskId}/complete`,
        method: 'POST'
      }),
      invalidatesTags: ['Workflows']
    }),
    updateNotes: builder.mutation<{success: boolean, data: WorkflowTask}, { taskId: string, notes: string }>({
      query: ({ taskId, notes }) => ({
        url: `/workflows/${taskId}/notes`,
        method: 'PATCH',
        body: { notes }
      }),
      invalidatesTags: ['Workflows']
    }),
    createWorkflow: builder.mutation<{success: boolean, data: WorkflowTask}, CreateWorkflowDto>({
      query: (body) => ({
        url: '/workflows',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Workflows']
    })
  }),
});

export const { 
  useGetWorkflowsQuery, 
  useEscalateWorkflowMutation, 
  usePauseWorkflowMutation, 
  useCompleteWorkflowMutation,
  useUpdateNotesMutation,
  useCreateWorkflowMutation
} = workflowsApi;
