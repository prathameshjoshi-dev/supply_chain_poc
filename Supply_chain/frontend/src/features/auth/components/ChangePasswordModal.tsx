import React, { useState } from 'react';
import { useChangePasswordMutation } from '../api/authApi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store';
import { logout } from '../slices/authSlice';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setErrorMsg('New password must contain an uppercase letter');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setErrorMsg('New password must contain a number');
      return;
    }

    try {
      await changePassword({
        email: user?.email,
        currentPassword,
        newPassword
      }).unwrap();
      
      setSuccessMsg('Password updated successfully. Logging out...');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
        dispatch(logout());
        navigate('/login');
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.data?.message || 'Failed to update password');
    }
  };

  const hasLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-border-subtle" 
        style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(24px)' }}
      >
        {/* Header */}
        <div className="p-8 border-b border-border-subtle">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-1">Change Password</h2>
              <p className="text-on-surface-variant font-body-md">Update your account security credentials.</p>
            </div>
            <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-status-success/10 border border-status-success/20 text-status-success rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface block" htmlFor="current-password">Current Password</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline-variant" 
                id="current-password" 
                placeholder="••••••••" 
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <span 
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer hover:text-primary select-none"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? 'visibility_off' : 'visibility'}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface block" htmlFor="new-password">New Password</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline-variant" 
                id="new-password" 
                placeholder="••••••••" 
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span 
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer hover:text-primary select-none"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? 'visibility_off' : 'visibility'}
              </span>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface block" htmlFor="confirm-password">Confirm New Password</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-lowest border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline-variant" 
                id="confirm-password" 
                placeholder="••••••••" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-surface-container-low rounded-lg p-4 border border-border-subtle/50">
            <p className="font-label-md text-xs text-on-surface-variant mb-3 uppercase tracking-tighter">Security Requirements</p>
            <ul className="space-y-2">
              <li className={`flex items-center gap-2 text-xs ${hasLength ? 'text-status-success' : 'text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: hasLength ? "'wght' 700" : undefined }}>
                  {hasLength ? 'check' : 'circle'}
                </span>
                At least 8 characters
              </li>
              <li className={`flex items-center gap-2 text-xs ${hasUppercase ? 'text-status-success' : 'text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: hasUppercase ? "'wght' 700" : undefined }}>
                  {hasUppercase ? 'check' : 'circle'}
                </span>
                One uppercase letter (A-Z)
              </li>
              <li className={`flex items-center gap-2 text-xs ${hasNumber ? 'text-status-success' : 'text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: hasNumber ? "'wght' 700" : undefined }}>
                  {hasNumber ? 'check' : 'circle'}
                </span>
                One numeric digit (0-9)
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-lg transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !hasLength || !hasUppercase || !hasNumber || newPassword !== confirmPassword}
              className="flex-2 px-8 py-3 bg-primary-container text-on-primary-container font-headline-sm text-label-md rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
