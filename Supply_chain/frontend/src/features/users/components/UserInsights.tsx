import React from 'react';
import type { UserInsights as InsightsData } from '../api/usersApi';

interface UserInsightsProps {
  insights: InsightsData | undefined;
  isLoading: boolean;
}

export const UserInsights: React.FC<UserInsightsProps> = ({ insights, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mt-8">
      <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="text-[10px] font-label-md text-primary uppercase tracking-[0.2em] mb-2">Total Capacity</div>
        <div className="font-display-lg text-display-lg text-on-surface">
          {isLoading ? '...' : (insights?.totalCapacity || 0).toLocaleString()}
        </div>
        <div className="flex items-center gap-1 mt-2 text-status-success text-xs font-bold">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +12% this month
        </div>
      </div>
      <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="text-[10px] font-label-md text-tertiary uppercase tracking-[0.2em] mb-2">Admin Accounts</div>
        <div className="font-display-lg text-display-lg text-on-surface">
          {isLoading ? '...' : (insights?.adminAccounts || 0).toLocaleString()}
        </div>
        <div className="text-xs text-on-surface-variant mt-2 font-medium">
          {insights?.totalCapacity ? ((insights.adminAccounts / insights.totalCapacity) * 100).toFixed(1) : '0'}% of workforce
        </div>
      </div>
      <div className="glass-card p-6 rounded-xl col-span-1 md:col-span-2 flex items-center justify-between border-primary/20 hover:border-primary/40 transition-colors">
        <div className="space-y-1">
          <h4 className="font-headline-sm text-headline-sm text-on-surface">Security Pulse</h4>
          <p className="text-xs text-on-surface-variant">System-wide permission check completed successfully.</p>
          <button className="mt-4 text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            View Audit History <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="w-24 h-24 relative flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="48" cy="48" fill="transparent" r="40" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="8"></circle>
            <circle 
              cx="48" 
              cy="48" 
              fill="transparent" 
              r="40" 
              stroke="#59d8e0" 
              strokeDasharray="251.2" 
              strokeDashoffset={251.2 - (251.2 * (insights?.activePercentage || 0)) / 100} 
              strokeWidth="8"
              className="transition-all duration-1000 ease-out"
            ></circle>
          </svg>
          <span className="absolute text-lg font-bold text-primary">{insights?.activePercentage || 0}%</span>
        </div>
      </div>
    </div>
  );
};
