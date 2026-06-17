import React, { useState } from 'react';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation
} from '../api/notificationsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { Layout } from '../../../components/layout/Layout';

const severityConfig = {
  critical: { icon: 'error', colorClass: 'text-status-critical', bgClass: 'bg-status-critical/10', borderClass: 'border-l-status-critical' },
  warning: { icon: 'inventory', colorClass: 'text-status-warning', bgClass: 'bg-status-warning/10', borderClass: 'border-l-status-warning' },
  info: { icon: 'account_tree', colorClass: 'text-primary', bgClass: 'bg-primary/10', borderClass: 'border-l-primary' },
  success: { icon: 'verified', colorClass: 'text-on-surface-variant', bgClass: 'bg-on-surface-variant/10', borderClass: 'border-l-primary/30' }
};

export const NotificationsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id || 'default-user-id';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('Past 24 Hours');
  const [entityFilter, setEntityFilter] = useState<string>('All Shipment Types');

  const { data: notifData, isLoading: notifsLoading } = useGetNotificationsQuery({
    page: 1,
    limit: 50,
    severity: activeCategory,
    timeRange,
    category: entityFilter
  }, {
    pollingInterval: 30000, // Poll every 30s to simulate live datafeed
  });

  const { data: prefsData } = useGetPreferencesQuery(userId);

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [updatePreferences] = useUpdatePreferencesMutation();

  const handleTogglePref = (key: 'inAppPush' | 'emailDigests' | 'smsAlerts') => {
    if (!prefsData) return;
    updatePreferences({
      userId,
      [key]: !prefsData[key]
    });
  };

  const notifications = notifData?.data || [];
  const stats = notifData?.stats || { total: 0, critical: 0, warning: 0, info: 0 };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout pageTitle='Notifications'>
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        <div className="flex-1 overflow-y-auto px-8 py-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed custom-scrollbar relative">
          <div className="absolute inset-0 bg-background-deep/95 z-0"></div>
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 relative z-10">

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4">Categories</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md transition-colors ${activeCategory === 'all' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">all_inbox</span> All Alerts
                    </span>
                    <span className="text-xs opacity-60">{stats.total}</span>
                  </button>
                  <button
                    onClick={() => setActiveCategory('critical')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md transition-colors ${activeCategory === 'critical' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg text-status-critical">report</span> Critical
                    </span>
                    <span className="text-xs opacity-60">{stats.critical}</span>
                  </button>
                  <button
                    onClick={() => setActiveCategory('warning')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md transition-colors ${activeCategory === 'warning' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg text-status-warning">warning</span> Warning
                    </span>
                    <span className="text-xs opacity-60">{stats.warning}</span>
                  </button>
                  <button
                    onClick={() => setActiveCategory('info')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md transition-colors ${activeCategory === 'info' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant/30'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg text-primary">info</span> Information
                    </span>
                    <span className="text-xs opacity-60">{stats.info}</span>
                  </button>
                </nav>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-body-md">In-app Push</span>
                    <div
                      onClick={() => handleTogglePref('inAppPush')}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${prefsData?.inAppPush ? 'bg-primary/40' : 'bg-surface-variant'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${prefsData?.inAppPush ? 'right-0.5 bg-primary' : 'left-0.5 bg-on-surface-variant'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-body-md">Email Digests</span>
                    <div
                      onClick={() => handleTogglePref('emailDigests')}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${prefsData?.emailDigests ? 'bg-primary/40' : 'bg-surface-variant'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${prefsData?.emailDigests ? 'right-0.5 bg-primary' : 'left-0.5 bg-on-surface-variant'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-body-md">SMS Alerts</span>
                    <div
                      onClick={() => handleTogglePref('smsAlerts')}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${prefsData?.smsAlerts ? 'bg-primary/40' : 'bg-surface-variant'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${prefsData?.smsAlerts ? 'right-0.5 bg-primary' : 'left-0.5 bg-on-surface-variant'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Feed */}
            <section className="col-span-12 lg:col-span-9 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">calendar_month</span>
                    <select
                      value={timeRange}
                      onChange={e => setTimeRange(e.target.value)}
                      className="bg-surface-container-high border-border-subtle rounded-lg pl-9 pr-8 py-2 text-xs font-label-md text-on-surface focus:ring-primary focus:border-primary appearance-none outline-none"
                    >
                      <option>Past 24 Hours</option>
                      <option>Past 7 Days</option>
                      <option>Past 30 Days</option>
                      <option>All Time</option>
                    </select>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">filter_alt</span>
                    <select
                      value={entityFilter}
                      onChange={e => setEntityFilter(e.target.value)}
                      className="bg-surface-container-high border-border-subtle rounded-lg pl-9 pr-8 py-2 text-xs font-label-md text-on-surface focus:ring-primary focus:border-primary appearance-none outline-none"
                    >
                      <option>All Shipment Types</option>
                      <option>Shipment</option>
                      <option>Inventory</option>
                      <option>Workflow</option>
                      <option>Security</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => markAllAsRead()}
                    disabled={unreadCount === 0}
                    className="flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none group"
                  >
                    <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">done_all</span>
                    Mark all as read
                  </button>
                  <p className="text-xs text-on-surface-variant font-mono-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                    SYNCING: LIVE DATAFEED [OK]
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {notifsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="glass-card p-12 rounded-xl text-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">notifications_off</span>
                    <h3 className="font-headline-sm text-on-surface">No alerts found</h3>
                    <p className="text-on-surface-variant text-sm mt-2">You're all caught up with your notifications.</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const config = severityConfig[notif.severity as keyof typeof severityConfig] || severityConfig.info;

                    return (
                      <div
                        key={notif._id}
                        className={`glass-card p-4 rounded-xl flex gap-4 items-start border-l-4 ${config.borderClass} group transition-all cursor-pointer ${notif.read ? 'opacity-70 hover:opacity-100' : 'hover:translate-x-1'}`}
                      >
                        <div className={`p-2 ${config.bgClass} rounded-lg ${config.colorClass}`}>
                          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {config.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-headline-sm text-sm font-bold ${notif.read ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] font-mono-md text-on-surface-variant">
                              {new Date(notif.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>
                          <p className="text-on-surface-variant text-sm mb-3">
                            {notif.message}
                          </p>
                          <div className="flex gap-3">
                            {notif.actions.map((act, idx) => (
                              <button
                                key={idx}
                                className={`text-xs font-label-md hover:underline ${act.actionVariant === 'primary' ? 'text-primary' :
                                    act.actionVariant === 'danger' ? 'text-status-critical' :
                                      'text-on-surface-variant hover:text-on-surface'
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Triggered action: ${act.actionType} for ${notif.entityId}`);
                                }}
                              >
                                {act.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        {!notif.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-on-surface transition-opacity"
                            title="Mark as read"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className="flex justify-center pt-8">
                  <button className="px-6 py-2 glass-card rounded-full text-on-surface-variant hover:text-primary transition-colors font-label-md text-xs flex items-center gap-2">
                    Load older notifications
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};
