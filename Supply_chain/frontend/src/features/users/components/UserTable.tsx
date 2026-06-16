import React, { useState } from 'react';
import type { User } from '../api/usersApi';

interface UserTableProps {
  users: User[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onBulkAction: (userIds: string[], action: 'delete' | 'suspend') => void;
  onEdit: (user: User) => void;
  onToggleStatus: (userId: string, newStatus: string) => void;
  isLoading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({ users, total, page, limit, onPageChange, onBulkAction, onEdit, onToggleStatus, isLoading }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(users.map(u => u._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const executeBulkAction = (action: 'delete' | 'suspend') => {
    if (selectedIds.length > 0) {
      onBulkAction(selectedIds, action);
      setSelectedIds([]);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'bg-primary/10 text-primary border border-primary/20';
      case 'manager': return 'bg-tertiary/10 text-tertiary border border-tertiary/20';
      default: return 'bg-surface-variant text-on-surface-variant border border-border-subtle';
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Bulk Actions Toolbar */}
      <div className="px-6 py-4 bg-primary/5 flex items-center justify-between border-b border-border-subtle min-h-[64px]">
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <input 
              type="checkbox" 
              checked={selectedIds.length === users.length && users.length > 0}
              onChange={handleSelectAll}
              className="rounded bg-surface-container border-outline text-primary focus:ring-primary focus:ring-offset-background" 
            />
            <span className="text-sm font-medium text-primary">{selectedIds.length} Selected</span>
            <div className="h-4 w-[1px] bg-border-subtle"></div>
            <div className="flex gap-2">
              <button 
                onClick={() => executeBulkAction('suspend')}
                className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant transition-colors" title="Bulk Suspend">
                <span className="material-symbols-outlined text-[18px]">block</span>
              </button>
              <button 
                onClick={() => executeBulkAction('delete')}
                className="p-1.5 hover:bg-error-container/20 rounded text-error transition-colors" title="Bulk Delete">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-on-surface-variant text-sm">
            Manage your organization's operators
          </div>
        )}
        <div className="text-on-surface-variant text-xs italic">
          Displaying {users.length} of {total} total operators
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto custom-scrollbar relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-high/50 text-on-surface-variant border-b border-border-subtle">
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="rounded bg-surface-container border-outline text-primary focus:ring-primary focus:ring-offset-background" 
                />
              </th>
              <th className="px-6 py-4 font-label-md text-[10px] uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">
                Operator <span className="material-symbols-outlined text-[12px] align-middle ml-1">expand_more</span>
              </th>
              <th className="px-6 py-4 font-label-md text-[10px] uppercase tracking-widest cursor-pointer hover:text-primary transition-colors">Role</th>
              <th className="px-6 py-4 font-label-md text-[10px] uppercase tracking-widest">Warehouse Scope</th>
              <th className="px-6 py-4 font-label-md text-[10px] uppercase tracking-widest">Last Activity</th>
              <th className="px-6 py-4 font-label-md text-[10px] uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {users.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">No users found matching your criteria.</td>
              </tr>
            )}
            {users.map(user => (
              <tr 
                key={user._id} 
                className={`group transition-all hover:bg-surface-variant/30 ${user.status === 'inactive' ? 'opacity-75' : ''}`}
              >
                <td className="px-6 py-4">
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(user._id)}
                    onChange={() => handleSelectOne(user._id)}
                    className="rounded bg-surface-container border-outline text-primary focus:ring-primary focus:ring-offset-background" 
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center font-bold text-primary overflow-hidden border border-border-subtle">
                      {user.avatar ? (
                         <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                         <span className="uppercase">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-on-surface group-hover:text-primary transition-colors">{user.name}</div>
                      <div className="text-xs text-on-surface-variant">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getRoleBadgeColor(user.role)} uppercase tracking-wider`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">warehouse</span>
                    <span>{user.warehouseScope || 'Global'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant font-mono-md">
                  {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4">
                  {user.status === 'active' ? (
                     <span className="status-pill bg-status-success/20 text-status-success border border-status-success/30">Active</span>
                  ) : (
                     <span className="status-pill bg-on-surface-variant/20 text-on-surface-variant border border-border-subtle">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                    className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors group-hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                  
                  {openMenuId === user._id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setOpenMenuId(null)}
                      ></div>
                      <div className="absolute right-10 top-10 w-48 bg-surface-container-high border border-border-subtle rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                        <button 
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit(user);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          <span className="font-label-md">Edit Operator</span>
                        </button>
                        <button 
                          onClick={() => {
                            setOpenMenuId(null);
                            onToggleStatus(user._id, user.status === 'active' ? 'inactive' : 'active');
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${user.status === 'active' ? 'text-status-warning hover:bg-status-warning/10' : 'text-status-success hover:bg-status-success/10'}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {user.status === 'active' ? 'block' : 'check_circle'}
                          </span>
                          <span className="font-label-md">Make {user.status === 'active' ? 'Inactive' : 'Active'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-surface-container-low/30">
        <div className="text-sm text-on-surface-variant">
          Showing <span className="text-on-surface">{users.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="text-on-surface">{Math.min(page * limit, total)}</span> of <span className="text-on-surface">{total}</span> results
        </div>
        <div className="flex gap-1">
          <button 
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded bg-surface-variant text-on-surface-variant hover:text-on-surface disabled:opacity-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
             <button 
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1.5 rounded transition-colors ${p === page ? 'bg-primary text-on-primary font-bold' : 'bg-surface-variant text-on-surface-variant hover:text-on-surface'}`}
             >
               {p}
             </button>
          ))}
          
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded bg-surface-variant text-on-surface-variant hover:text-on-surface disabled:opacity-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
