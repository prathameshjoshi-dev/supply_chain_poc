import React, { useState } from 'react';
import { 
  useGetWorkflowsQuery, 
  useEscalateWorkflowMutation, 
  usePauseWorkflowMutation, 
  useCompleteWorkflowMutation,
  useUpdateNotesMutation,
  type WorkflowTask
} from '../api/workflowsApi';
import { Layout } from '../../../components/layout/Layout';
import { CreateTaskModal } from '../components/CreateTaskModal';

type TabStatus = 'Open' | 'In-Progress' | 'Resolved' | 'Escalated';

export const WorkflowsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabStatus>('Open');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Use undefined for Open if we want all? Actually we want only the active tab status.
  const { data: workflowsData, isLoading } = useGetWorkflowsQuery({ status: activeTab });
  
  // We can fetch all stats by querying without status, but let's just use what we have or mock counts for now to keep it simple.
  // In a real app we might have a /kpis endpoint for workflows.
  const { data: allWorkflows } = useGetWorkflowsQuery({});

  const [escalate] = useEscalateWorkflowMutation();
  const [pause] = usePauseWorkflowMutation();
  const [complete] = useCompleteWorkflowMutation();
  const [updateNotes] = useUpdateNotesMutation();

  const handleTaskSelect = (task: WorkflowTask) => {
    setSelectedTaskId(task.taskId);
    setNotesDraft(task.notes || '');
  };

  const handleNotesSave = async () => {
    if (selectedTaskId) {
      await updateNotes({ taskId: selectedTaskId, notes: notesDraft });
    }
  };

  const handleAction = async (action: 'escalate' | 'pause' | 'complete') => {
    if (!selectedTaskId) return;
    try {
      if (action === 'escalate') await escalate(selectedTaskId).unwrap();
      if (action === 'pause') await pause(selectedTaskId).unwrap();
      if (action === 'complete') await complete(selectedTaskId).unwrap();
      setSelectedTaskId(null);
    } catch (e) {
      console.error(`Failed to ${action} workflow`, e);
    }
  };

  const items = workflowsData?.data || [];
  const selectedTask = items.find(i => i.taskId === selectedTaskId);

  const getCounts = () => {
    const counts = { 'Open': 0, 'In-Progress': 0, 'Resolved': 0, 'Escalated': 0 };
    if (allWorkflows?.data) {
      allWorkflows.data.forEach(w => {
        counts[w.status]++;
      });
    }
    return counts;
  };
  const counts = getCounts();

  const getPriorityStyle = (priority: string) => {
    if (priority.includes('Critical')) return 'border-status-critical';
    if (priority.includes('High')) return 'border-status-warning';
    return 'border-primary';
  };

  const getPriorityBadgeStyle = (priority: string) => {
    if (priority.includes('Critical')) return 'bg-status-critical/20 text-status-critical';
    if (priority.includes('High')) return 'bg-status-warning/20 text-status-warning';
    return 'bg-primary/20 text-primary';
  };

  return (
    <Layout pageTitle="Operational Workflows">
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar bg-background">
        <div className="flex-1 pt-8 px-8 pb-12">
          {/* Dashboard Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">Operational Workflows</h2>
              <p className="text-on-surface-variant font-body-md mt-1">Global supply chain task orchestration and real-time intervention.</p>
            </div>
            <button 
              className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-label-md flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <span className="material-symbols-outlined text-md">add</span>
              Create Task
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-border-subtle pb-px">
            {(['Open', 'In-Progress', 'Resolved', 'Escalated'] as TabStatus[]).map(tab => {
              const isActive = activeTab === tab;
              const count = counts[tab];
              
              let countClass = "bg-surface-variant";
              if (isActive && tab !== 'Escalated') countClass = "bg-primary/20";
              if (tab === 'Escalated') countClass = "text-status-critical bg-status-critical/10";
              
              return (
                <button 
                  key={tab}
                  className={`px-6 py-3 transition-all flex items-center gap-2 ${isActive ? 'border-b-2 border-primary text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => { setActiveTab(tab); setSelectedTaskId(null); }}
                >
                  {tab} <span className={`${countClass} px-2 py-0.5 rounded text-[10px]`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-12 gap-gutter items-start">
            {/* Task List / Kanban Column */}
            <div className={`col-span-12 ${selectedTask ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-4 transition-all duration-300`}>
              {isLoading ? (
                <div className="text-on-surface-variant p-4">Loading tasks...</div>
              ) : items.length === 0 ? (
                <div className="text-on-surface-variant p-4">No tasks found for this status.</div>
              ) : items.map(task => (
                <div 
                  key={task._id} 
                  onClick={() => handleTaskSelect(task)}
                  className={`glass-card p-5 rounded-xl transition-all cursor-pointer border-l-4 ${getPriorityStyle(task.priority)} flex flex-col gap-4 ${selectedTaskId === task.taskId ? 'ring-2 ring-primary/50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-md text-mono-md text-primary">#{task.taskId}</span>
                        <span className={`${getPriorityBadgeStyle(task.priority)} text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider`}>
                          {task.priority}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm mt-1">{task.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-label-md text-on-surface-variant block">
                        {new Date(task.dueAt).toDateString() === new Date().toDateString() ? 'Due Today' : 'Due ' + new Date(task.dueAt).toLocaleDateString()}
                      </span>
                      <span className={`${task.priority.includes('Critical') ? 'text-status-critical' : 'text-on-surface-variant'} font-bold text-label-md`}>
                        {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">category</span>
                        <span className="text-body-md">{task.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
                        <span className="text-body-md">{task.assignees.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border border-background bg-surface-variant overflow-hidden flex justify-center items-center">
                         <span className="text-[10px] text-on-surface">{task.assignees[0]?.[0]}</span>
                      </div>
                      {task.assignees.length > 1 && (
                        <div className="w-6 h-6 rounded-full border border-background bg-surface-bright overflow-hidden flex justify-center items-center">
                          <span className="text-[10px] text-on-surface">{task.assignees[1]?.[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Task View (Sidebar Style) */}
            {selectedTask && (
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-[calc(100vh-200px)] sticky top-24">
                <div className="glass-card p-6 rounded-xl flex flex-col h-full border-l border-t border-border-subtle/50">
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono-md text-mono-md text-primary">#{selectedTask.taskId} Details</span>
                    <button 
                      className="text-on-surface-variant hover:text-on-surface transition-all"
                      onClick={() => setSelectedTaskId(null)}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                    {/* Summary */}
                    <section>
                      <h4 className="font-label-md text-on-surface-variant uppercase tracking-widest mb-3">Incident Summary</h4>
                      <p className="text-body-md leading-relaxed">{selectedTask.summary}</p>
                    </section>
                    
                    {/* Progress Bar */}
                    <div className="bg-surface-container-highest h-2 w-full rounded-full overflow-hidden">
                      <div 
                        className={`${selectedTask.status === 'Resolved' ? 'bg-status-success' : selectedTask.priority.includes('Critical') ? 'bg-status-critical' : 'bg-primary'} h-full transition-all`} 
                        style={{ 
                          width: `${selectedTask.progress}%`,
                          boxShadow: selectedTask.priority.includes('Critical') ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
                        }}
                      ></div>
                    </div>
                    
                    {/* Audit Trail */}
                    <section>
                      <h4 className="font-label-md text-on-surface-variant uppercase tracking-widest mb-4">Audit Trail</h4>
                      <div className="space-y-4 border-l border-border-subtle ml-2 pl-4">
                        {selectedTask.auditTrail.map((entry, idx) => (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${entry.isCritical ? 'bg-status-critical' : 'bg-primary'}`}></div>
                            <div className="text-[11px] text-on-surface-variant font-mono-md">
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {entry.user}
                            </div>
                            <p className="text-body-md">{entry.message}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                    
                    {/* Notes Area */}
                    <section>
                      <h4 className="font-label-md text-on-surface-variant uppercase tracking-widest mb-3">Operator Notes</h4>
                      <textarea 
                        className="w-full bg-surface-container-highest border-border-subtle rounded-lg p-3 text-body-md focus:ring-1 focus:ring-primary h-24 placeholder:text-on-surface-variant/30 text-on-surface" 
                        placeholder="Add observation..."
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        onBlur={handleNotesSave}
                      ></textarea>
                    </section>
                  </div>
                  
                  {/* Action Buttons */}
                  {selectedTask.status !== 'Resolved' && (
                    <div className="mt-6 pt-6 border-t border-border-subtle flex flex-col gap-3">
                      {selectedTask.status !== 'Escalated' && (
                        <button 
                          onClick={() => handleAction('escalate')}
                          className="w-full bg-status-critical/10 text-status-critical border border-status-critical/20 py-3 rounded-lg font-bold hover:bg-status-critical hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">priority_high</span>
                          Escalate to Supervisor
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleAction('pause')}
                          className="bg-surface-variant text-on-surface py-3 rounded-lg font-bold hover:bg-surface-bright transition-all"
                        >
                          {selectedTask.status === 'In-Progress' ? 'Update Status' : 'Pause'}
                        </button>
                        <button 
                          onClick={() => handleAction('complete')}
                          className="bg-primary text-on-primary py-3 rounded-lg font-bold hover:brightness-110 transition-all"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </Layout>
  );
};
