import React from 'react';

interface UserFiltersProps {
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  scopeFilter: string;
  setScopeFilter: (scope: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onInviteClick: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  roleFilter, setRoleFilter, scopeFilter, setScopeFilter, searchQuery, setSearchQuery, onInviteClick
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-end mb-6">
      <div className="grid grid-cols-2 md:flex gap-4 w-full md:w-auto">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider ml-1">Filter by Role</label>
          <select 
            className="bg-surface-container border border-border-subtle rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-primary focus:border-primary appearance-none min-w-[140px]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Viewer</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider ml-1">Warehouse Scope</label>
          <select 
            className="bg-surface-container border border-border-subtle rounded-lg px-3 py-2 text-sm text-on-surface focus:ring-primary focus:border-primary appearance-none min-w-[140px]"
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
          >
            <option>All Scopes</option>
            <option>Global</option>
            <option>Regional</option>
            <option>Hub 42-X</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative group flex-1 md:flex-none">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">search</span>
          <input 
            className="w-full bg-surface-container border border-border-subtle rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder-on-surface-variant" 
            placeholder="Search operators..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={onInviteClick}
          className="flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span className="font-label-md">Invite User</span>
        </button>
      </div>
    </div>
  );
};
