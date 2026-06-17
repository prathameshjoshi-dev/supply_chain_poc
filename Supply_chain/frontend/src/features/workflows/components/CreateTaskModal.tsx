import React, { useState } from 'react';
import { useCreateWorkflowMutation } from '../api/workflowsApi';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const [createWorkflow] = useCreateWorkflowMutation();
  const [category, setCategory] = useState('Replenishment');
  const [priority, setPriority] = useState('High');
  const [assignee, setAssignee] = useState('');
  const [relatedEntityId, setRelatedEntityId] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await createWorkflow({
        category,
        priority,
        assignee,
        relatedEntityId,
        dueAt: dueAt || new Date().toISOString(), // Fallback if empty
        notes
      }).unwrap();
      
      // Reset form and close
      setCategory('Replenishment');
      setPriority('High');
      setAssignee('');
      setRelatedEntityId('');
      setDueAt('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const priorities = [
    { label: 'Low', colorClass: 'bg-primary border-primary', activeClass: 'bg-primary/10 border-primary' },
    { label: 'Medium', colorClass: 'bg-secondary border-secondary', activeClass: 'bg-secondary/10 border-secondary' },
    { label: 'High', colorClass: 'bg-status-warning border-status-warning', activeClass: 'bg-status-warning/10 border-status-warning' },
    { label: 'Critical', colorClass: 'bg-status-critical border-status-critical', activeClass: 'bg-status-critical/10 border-status-critical' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" id="modal-overlay">
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[921px]">
        
        {/* Modal Header */}
        <header className="p-6 border-b border-border-subtle/30 flex justify-between items-center bg-surface-glass">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">add_task</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Create New Task</h3>
              <p className="text-xs text-on-surface-variant">Logistics Intelligence System Protocol</p>
            </div>
          </div>
          <button 
            className="w-10 h-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </header>

        {/* Modal Content (Scrollable) */}
        <div className="p-8 overflow-y-auto space-y-8 bg-surface-container-low/30 text-on-surface">
          
          {/* Task Type & Priority Row */}
          <div className="grid grid-cols-2 gap-gutter">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Task Type</label>
              <div className="relative">
                <select 
                  className="w-full bg-surface-container-highest border border-border-subtle rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Replenishment">Replenishment</option>
                  <option value="Shipment Approval">Shipment Approval</option>
                  <option value="Discrepancy Resolution">Discrepancy Resolution</option>
                  <option value="Quality Audit">Quality Audit</option>
                  <option value="Carrier Re-routing">Carrier Re-routing</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Priority Level</label>
              <div className="grid grid-cols-4 gap-2 h-12">
                {priorities.map((p) => (
                  <button 
                    key={p.label}
                    className={`priority-btn border rounded-lg flex items-center justify-center hover:bg-surface-container-highest transition-all ${priority === p.label ? p.activeClass : 'border-border-subtle/30'}`}
                    title={p.label}
                    onClick={() => setPriority(p.label)}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${p.colorClass.split(' ')[0]} ${priority === p.label && p.label === 'Critical' ? 'animate-pulse' : ''}`}></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignee & Entity Row */}
          <div className="grid grid-cols-2 gap-gutter">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Assignee</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">person_search</span>
                <input 
                  className="w-full bg-surface-container-highest border border-border-subtle rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                  placeholder="Search operators..." 
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Related Entity ID</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">database</span>
                <input 
                  className="w-full bg-surface-container-highest border border-border-subtle rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono-md" 
                  placeholder="SHP-000-000 or SKU" 
                  type="text"
                  value={relatedEntityId}
                  onChange={(e) => setRelatedEntityId(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Due Date</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">calendar_today</span>
              <input 
                className="w-full bg-surface-container-highest border border-border-subtle rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface [color-scheme:dark]" 
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Notes & Special Instructions</label>
            <textarea 
              className="w-full bg-surface-container-highest border border-border-subtle rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" 
              placeholder="Provide detailed workflow context for the operator..." 
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <span className="text-[10px] text-on-surface-variant/60 font-mono-md">ENCRYPTION: AES-256 ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <footer className="p-6 border-t border-border-subtle/30 flex justify-between items-center bg-surface-glass">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">info</span>
            This task will trigger an automated AI monitoring loop.
          </div>
          <div className="flex gap-4">
            <button 
              className="px-6 py-2.5 font-bold text-on-surface hover:bg-surface-container-highest rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-8 py-2.5 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={!category || !priority}
            >
              Create Task
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
