import React, { useState, useEffect } from 'react';
import { useGetUsersQuery, useGetInsightsQuery, useBulkActionMutation, useCreateUserMutation, useUpdateUserMutation } from '../api/usersApi';
import { UserFilters } from '../components/UserFilters';
import { UserTable } from '../components/UserTable';
import { UserInsights } from '../components/UserInsights';
import { InviteUserModal } from '../components/InviteUserModal';
import { EditUserModal } from '../components/EditUserModal';
import { PermissionsManager } from '../components/PermissionsManager';
import { Layout } from '../../../components/layout/Layout';
import type { User } from '../api/usersApi';

export const UsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [scopeFilter, setScopeFilter] = useState('All Scopes');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Operators');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  // Debounce search query to prevent excessive API calls
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, scopeFilter]);

  const { data: usersData, isLoading, refetch } = useGetUsersQuery({
    page,
    limit: 5,
    search: debouncedSearch || undefined,
    role: roleFilter !== 'All Roles' ? roleFilter : undefined,
    warehouseScope: scopeFilter !== 'All Scopes' ? scopeFilter : undefined,
  });

  const { data: insightsData, isLoading: isInsightsLoading } = useGetInsightsQuery();
  const [bulkAction] = useBulkActionMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleBulkAction = async (userIds: string[], action: 'delete' | 'suspend') => {
    if (window.confirm(`Are you sure you want to ${action} ${userIds.length} users?`)) {
      try {
        await bulkAction({ userIds, action }).unwrap();
        // Option to show a toast notification here
      } catch (err) {
        console.error('Bulk action failed', err);
      }
    }
  };

  const handleInviteSubmit = async (userData: any) => {
    try {
      await createUser(userData).unwrap();
      setIsInviteModalOpen(false);
    } catch (err: any) {
      console.error('Failed to create user', err);
      alert(err?.data?.message || 'Failed to create user. Ensure the email is unique and valid.');
    }
  };

  const handleEditClick = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (userId: string, userData: Partial<User>) => {
    try {
      await updateUser({ id: userId, data: userData }).unwrap();
      setIsEditModalOpen(false);
      setUserToEdit(null);
    } catch (err: any) {
      console.error('Failed to update user', err);
      alert(err?.data?.message || 'Failed to update user.');
    }
  };

  const handleToggleStatus = async (userId: string, newStatus: string) => {
    try {
      await updateUser({ id: userId, data: { status: newStatus } }).unwrap();
    } catch (err: any) {
      console.error('Failed to toggle status', err);
      alert('Failed to change user status.');
    }
  };

  const tabs = [
    { label: 'Operators', active: activeTab === 'Operators', onClick: () => setActiveTab('Operators') },
    { label: 'Permissions', active: activeTab === 'Permissions', onClick: () => setActiveTab('Permissions') },
    { label: 'Activity Log', active: activeTab === 'Activity Log', onClick: () => alert('Activity Log tab') }
  ];

  return (
    <Layout tabs={tabs}>
      {activeTab === 'Operators' ? (
        <>
          <UserFilters 
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            scopeFilter={scopeFilter}
            setScopeFilter={setScopeFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onInviteClick={() => setIsInviteModalOpen(true)}
          />
          
          <UserTable 
            users={usersData?.data || []}
            total={usersData?.total || 0}
            page={usersData?.page || 1}
            limit={usersData?.limit || 5}
            onPageChange={setPage}
            onBulkAction={handleBulkAction}
            onEdit={handleEditClick}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />

          <UserInsights 
            insights={insightsData}
            isLoading={isInsightsLoading}
          />
        </>
      ) : activeTab === 'Permissions' ? (
        <PermissionsManager />
      ) : null}

      <InviteUserModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSubmit={handleInviteSubmit}
        isLoading={isCreating}
      />

      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setUserToEdit(null);
        }} 
        onSubmit={handleEditSubmit}
        isLoading={isUpdating}
        user={userToEdit}
      />
    </Layout>
  );
};
