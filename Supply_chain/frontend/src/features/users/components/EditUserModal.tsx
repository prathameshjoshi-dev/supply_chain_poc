import React, { useState, useEffect } from 'react';
import type { User } from '../api/usersApi';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, userData: Partial<User>) => void;
  isLoading: boolean;
  user: User | null;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSubmit, isLoading, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    warehouseScope: 'Global',
    status: 'active'
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        warehouseScope: user.warehouseScope || 'Global',
        status: user.status || 'active'
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user._id, formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-background-deep/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="glass-card relative w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-headline-md text-primary">Edit Operator</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider ml-1">Full Name</label>
            <input 
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text" 
              className="w-full bg-surface-container border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
            <input 
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email" 
              className="w-full bg-surface-container border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all opacity-70 cursor-not-allowed"
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider ml-1">Role</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-surface-container border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary appearance-none transition-all"
              >
                <option value="viewer">Viewer</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider ml-1">Warehouse Scope</label>
              <select 
                name="warehouseScope"
                value={formData.warehouseScope}
                onChange={handleChange}
                className="w-full bg-surface-container border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary appearance-none transition-all"
              >
                <option value="Global">Global</option>
                <option value="Regional">Regional</option>
                <option value="Hub 42-X">Hub 42-X</option>
                <option value="EMEA Region">EMEA Region</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-label-md text-on-surface-variant uppercase tracking-wider ml-1">Account Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-surface-container border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary appearance-none transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border-subtle text-on-surface hover:bg-surface-variant transition-colors text-sm font-medium"
            >
              <span className="font-label-md">Cancel</span>
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95 transition-all text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></span>}
              <span className="font-label-md">Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
