import React, { useState, useEffect, useMemo } from 'react';
import { useGetRolesQuery, useUpdateRoleMutation, type Role } from '../api/rolesApi';

const MODULES = [
  {
    id: 'auth',
    title: 'Authentication & Security',
    icon: 'lock',
    permissions: [
      { id: 'auth.mfa_enforce', title: 'Multi-Factor Enforcement', desc: 'Require all users in this role to use 2FA' },
      { id: 'auth.api_keys', title: 'API Key Management', desc: 'Generate and revoke system-level API tokens' },
      { id: 'auth.password_override', title: 'Password Policy Override', desc: 'Ability to bypass standard complexity rules' },
      { id: 'auth.global_logout', title: 'Global Session Termination', desc: 'Force logout on any user account' },
    ],
  },
  {
    id: 'user',
    title: 'User & Team Management',
    icon: 'group',
    permissions: [
      { id: 'user.create', title: 'Create New Users', desc: 'Invite and onboard new team members' },
      { id: 'user.modify_rbac', title: 'Modify RBAC Roles', desc: 'Edit permission sets for existing roles' },
      { id: 'user.bulk_import', title: 'Bulk Import/Export', desc: 'Manage user data via CSV/JSON uploads' },
      { id: 'user.delete_core', title: 'Delete Core Entities', desc: 'Hard-delete user accounts and records', critical: true },
    ],
  },
  {
    id: 'workflow',
    title: 'Workflow Orchestration',
    icon: 'account_tree',
    permissions: [
      { id: 'workflow.pipeline', title: 'Pipeline Automation', desc: 'Define and edit automated shipping logic' },
      { id: 'workflow.critical_alert', title: 'Critical Alerting', desc: 'Configure system-wide anomaly alerts' },
    ],
  },
  {
    id: 'report',
    title: 'Reporting & AI Insights',
    icon: 'analytics',
    permissions: [
      { id: 'report.financial', title: 'Financial Forecasting', desc: 'Access predicted revenue and cost analysis' },
      { id: 'report.ai_finetune', title: 'AI Model Fine-tuning', desc: 'Direct access to retraining local LLM agents' },
    ],
  },
];

export const PermissionsManager: React.FC = () => {
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [localPermissions, setLocalPermissions] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0]._id);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = useMemo(() => roles.find((r) => r._id === selectedRoleId), [roles, selectedRoleId]);

  useEffect(() => {
    if (selectedRole) {
      setLocalPermissions(selectedRole.permissions || []);
      setIsDirty(false);
    }
  }, [selectedRole]);

  const handleRoleSelect = (id: string) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Discard them?')) return;
    }
    setSelectedRoleId(id);
  };

  const handleTogglePermission = (permissionId: string) => {
    setLocalPermissions((prev) => {
      const newPerms = prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId];
      setIsDirty(true);
      return newPerms;
    });
  };

  const handleDiscard = () => {
    if (selectedRole) {
      setLocalPermissions(selectedRole.permissions || []);
      setIsDirty(false);
    }
  };

  const handleDeploy = async () => {
    if (!selectedRole) return;
    try {
      await updateRole({ id: selectedRole._id, data: { permissions: localPermissions } }).unwrap();
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to update role', err);
      alert('Failed to save permissions.');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-on-surface-variant flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const roleIcons: Record<string, string> = {
    admin: 'security',
    manager: 'manage_accounts',
    supervisor: 'supervisor_account',
    viewer: 'visibility',
  };

  return (
    <div className="flex-1 flex flex-col gap-gutter overflow-hidden h-full pb-4">
      {/* Bento Grid Header / Stats */}
      <div className="grid grid-cols-12 gap-gutter shrink-0">
        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div>
            <span className="text-primary font-label-md text-[10px] tracking-widest uppercase">Configuration Context</span>
            <h3 className="font-headline-lg text-headline-lg mt-1 mb-4">RBAC System Architecture</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-on-surface-variant text-xs">Total Roles</p>
              <p className="font-headline-md text-headline-md">{roles.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-on-surface-variant text-xs">Active Users</p>
              <p className="font-headline-md text-headline-md">842</p>
            </div>
            <div className="space-y-1">
              <p className="text-on-surface-variant text-xs">Permissions</p>
              <p className="font-headline-md text-headline-md">{MODULES.reduce((acc, m) => acc + m.permissions.length, 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-on-surface-variant text-xs">Policy Sync</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                <p className="font-headline-md text-headline-md">{isDirty ? 'Pending' : '99%'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selector Widget */}
        <div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-headline-sm text-headline-sm">Select Role</h4>
            <button className="text-primary text-xs hover:underline">Create New</button>
          </div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
            {roles.map((role) => {
              const isSelected = selectedRoleId === role._id;
              return (
                <button
                  key={role._id}
                  onClick={() => handleRoleSelect(role._id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-primary-container/10 border border-primary/30 text-primary'
                      : 'bg-surface-variant/20 border border-transparent hover:border-outline-variant text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>
                      {roleIcons[role.name] || 'person'}
                    </span>
                    <span className="font-body-md font-semibold">{role.displayName}</span>
                  </div>
                  <span className="material-symbols-outlined text-sm">
                    {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Permissions Matrix */}
      <div className="flex-1 glass-card rounded-xl flex flex-col overflow-hidden min-h-0 border border-border-subtle">
        {/* Matrix Header */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-surface-variant/10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-64 text-on-surface" 
                placeholder="Search permissions..." 
                type="text"
              />
            </div>
            <div className="flex gap-2 hidden md:flex">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-tighter">
                {selectedRole?.displayName || 'Role'} View
              </span>
              {isDirty && (
                <span className="px-3 py-1 rounded-full bg-status-warning/20 border border-status-warning/50 text-status-warning text-[10px] font-bold uppercase tracking-tighter">
                  Draft Changes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Matrix Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="divide-y divide-outline-variant/20">
            {MODULES.map((module) => {
              const activeCount = module.permissions.filter((p) => localPermissions.includes(p.id)).length;
              return (
                <section key={module.id}>
                  <div className="px-6 py-4 bg-surface-container-high/50 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">{module.icon}</span>
                      <h5 className="font-headline-sm text-headline-sm">{module.title}</h5>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      {activeCount === module.permissions.length ? 'All Active' : `${activeCount} Active Permissions`}
                    </span>
                  </div>
                  <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {module.permissions.map((perm) => {
                      const isActive = localPermissions.includes(perm.id);
                      return (
                        <label 
                          key={perm.id}
                          className={`permission-row group flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-white/5'}`}
                        >
                          <div>
                            <p className="font-body-md font-semibold text-on-surface">{perm.title}</p>
                            <p className="text-xs text-on-surface-variant">{perm.desc}</p>
                          </div>
                          {perm.critical && !isActive && selectedRole?.name !== 'admin' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-status-critical font-bold uppercase">Locked</span>
                              <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-transparent opacity-30" disabled type="checkbox" />
                            </div>
                          ) : (
                            <input 
                              type="checkbox"
                              checked={isActive}
                              onChange={() => handleTogglePermission(perm.id)}
                              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-transparent cursor-pointer"
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low/80 flex items-center justify-between shrink-0">
          <p className="text-xs text-on-surface-variant italic flex items-center">
            <span className="material-symbols-outlined text-[14px] mr-1">info</span>
            {isDirty ? 'You have unsaved changes.' : 'Unsaved changes will be lost upon session expiration.'}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleDiscard}
              disabled={!isDirty || isUpdating}
              className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-variant transition-all text-sm font-semibold disabled:opacity-50"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleDeploy}
              disabled={!isDirty || isUpdating}
              className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>}
              Review & Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
