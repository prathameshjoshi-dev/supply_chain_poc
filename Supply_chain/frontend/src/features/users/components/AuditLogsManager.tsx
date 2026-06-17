import React, { useState, useEffect } from 'react';
import { useGetAuditLogsQuery, type AuditLog } from '../api/auditLogsApi';
import * as XLSX from 'xlsx';

const actionColors: Record<string, string> = {
  CREATE: 'bg-status-success/10 text-status-success border-status-success/20',
  UPDATE: 'bg-primary-container/10 text-primary border-primary/20',
  DELETE: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  AUTH: 'bg-status-warning/10 text-status-warning border-status-warning/20',
};

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
};

export const AuditLogsManager: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [user, setUser] = useState('');
  const [action, setAction] = useState('All Actions');
  const [entity, setEntity] = useState('All Entities');

  // Applied filters to pass to API
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'Last 7 Days',
    user: '',
    action: 'All Actions',
    entity: 'All Entities'
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAuditLogsQuery({
    page,
    limit,
    ...appliedFilters,
  });

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({ dateRange, user, action, entity });
  };

  const handleExport = () => {
    if (!data?.data || data.data.length === 0) return;

    const exportData = data.data.map(log => {
      const dateObj = new Date(log.timestamp);
      const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;

      return {
        Timestamp: formattedDate,
        User: log.user.name,
        Action: log.action,
        Entity: log.entity,
        'Entity ID': log.entityId,
        'Source IP': log.sourceIp,
        Severity: log.severity
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs');
    XLSX.writeFile(wb, `Audit_Logs_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const logs = data?.data || [];
  const stats = data?.stats || { totalEvents: 0, criticalActions: 0, authFailures: 0, uptime: '100%' };
  const totalLogs = data?.total || 0;
  const totalPages = Math.ceil(totalLogs / limit);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative z-10 w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2 mt-4">
        <div className="flex gap-3 ml-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-variant transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_download</span>
            Export Logs
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-variant transition-all"
          >
            <span className={`material-symbols-outlined text-[18px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1 pb-12 pr-2 px-2">
        {/* Filters Section */}
        <div className="glass-card rounded-xl p-6 mb-8 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-label-md font-label-md text-on-surface-variant">Date Range</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">calendar_today</span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all outline-none text-on-surface"
                >
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-md font-label-md text-on-surface-variant">User</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">person</span>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="All Users"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-md font-label-md text-on-surface-variant">Action Type</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">bolt</span>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all outline-none text-on-surface"
                >
                  <option>All Actions</option>
                  <option>CREATE</option>
                  <option>UPDATE</option>
                  <option>DELETE</option>
                  <option>AUTH</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-md font-label-md text-on-surface-variant">Entity Affected</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">category</span>
                <select
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all outline-none text-on-surface"
                >
                  <option>All Entities</option>
                  <option>Shipments</option>
                  <option>Inventory</option>
                  <option>User Access</option>
                  <option>Report</option>
                  <option>Workflow</option>
                  <option>Login Session</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleApplyFilters}
                className="w-full py-2 bg-primary-container/20 text-primary border border-primary/30 rounded-lg font-label-md hover:bg-primary-container/30 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Log Stats (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
          <div className="glass-card rounded-xl p-5 border-l-4 border-l-primary">
            <p className="text-label-md font-label-md text-on-surface-variant mb-2">Total Events (7d)</p>
            <h3 className="text-display-lg font-display-lg text-on-surface">
              <AnimatedNumber value={stats.totalEvents} />
            </h3>
            <div className="flex items-center gap-2 mt-2 text-status-success">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="text-label-md">+4.2% from prev. period</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border-l-4 border-l-status-warning">
            <p className="text-label-md font-label-md text-on-surface-variant mb-2">Critical Actions</p>
            <h3 className="text-display-lg font-display-lg text-on-surface">
              <AnimatedNumber value={stats.criticalActions} />
            </h3>
            <div className="flex items-center gap-2 mt-2 text-on-surface-variant">
              <span className="text-label-md">Requires peer review</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border-l-4 border-l-status-critical">
            <p className="text-label-md font-label-md text-on-surface-variant mb-2">Auth Failures</p>
            <h3 className="text-display-lg font-display-lg text-on-surface">
              <AnimatedNumber value={stats.authFailures} />
            </h3>
            <div className="flex items-center gap-2 mt-2 text-status-critical">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span className="text-label-md">Elevated risk detected</span>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border-l-4 border-l-status-success">
            <p className="text-label-md font-label-md text-on-surface-variant mb-2">System Uptime</p>
            <h3 className="text-display-lg font-display-lg text-on-surface">{stats.uptime}</h3>
            <div className="flex items-center gap-2 mt-2 text-status-success">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span className="text-label-md">Nodes healthy</span>
            </div>
          </div>
        </div>

        {/* Logs Table Section */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col shrink-0 border border-outline-variant/30">
          <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant bg-surface-variant/20">
            <h4 className="font-headline-sm text-headline-sm text-on-surface">Live Event Stream</h4>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-surface-container-high/90 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Entity Affected</th>
                  <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Source / IP</th>
                  <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 relative">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                      <div className="flex justify-center mb-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      Loading audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                      No logs found matching criteria.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const dateObj = new Date(log.timestamp);
                    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}.${String(dateObj.getMilliseconds()).padStart(3, '0')}`;

                    return (
                      <tr key={log._id} className="hover:bg-primary-container/5 transition-colors group">
                        <td className="px-6 py-4 font-mono-md text-mono-md text-on-surface-variant whitespace-nowrap">{formattedDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${log.user.colorClass}`}>
                              {log.user.initials}
                            </div>
                            <span className="text-body-md font-medium text-on-surface whitespace-nowrap">{log.user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-label-md font-mono-md border ${actionColors[log.action] || 'bg-surface-variant text-on-surface'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-body-md font-medium text-on-surface">{log.entity}</span>
                            <span className="text-mono-md text-on-surface-variant">{log.entityId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono-md text-mono-md text-on-surface-variant">{log.sourceIp}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-low">
            <p className="text-label-md text-on-surface-variant">
              Showing {logs.length > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, totalLogs)} of {stats.totalEvents.toLocaleString()} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">first_page</span>
              </button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md">{page}</button>
                {page < totalPages && (
                  <button onClick={() => setPage(page + 1)} className="w-8 h-8 rounded-lg hover:bg-surface-variant text-on-surface-variant font-label-md transition-colors">{page + 1}</button>
                )}
                {page + 1 < totalPages && (
                  <button onClick={() => setPage(page + 2)} className="w-8 h-8 rounded-lg hover:bg-surface-variant text-on-surface-variant font-label-md transition-colors">{page + 2}</button>
                )}
                {page + 2 < totalPages && (
                  <>
                    <span className="text-on-surface-variant px-1">...</span>
                    <button onClick={() => setPage(totalPages)} className="w-8 h-8 rounded-lg hover:bg-surface-variant text-on-surface-variant font-label-md transition-colors">{totalPages}</button>
                  </>
                )}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 rounded-lg hover:bg-surface-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">last_page</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-8 flex flex-wrap gap-4 shrink-0">
          <div className="glass-card px-4 py-3 rounded-lg flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-surface-container bg-primary-container/30 flex items-center justify-center text-[8px] text-primary">W1</div>
              <div className="w-6 h-6 rounded-full border-2 border-surface-container bg-secondary-container/30 flex items-center justify-center text-[8px] text-secondary">W2</div>
            </div>
            <p className="text-label-md text-on-surface-variant"><span className="text-primary font-semibold">2 Active Reviewers</span> monitoring logs</p>
          </div>
          <div className="glass-card px-4 py-3 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-status-success text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>encrypted</span>
            <p className="text-label-md text-on-surface-variant">Log Integrity: <span className="text-status-success font-semibold">Verified (SHA-256)</span></p>
          </div>
          <div className="glass-card px-4 py-3 rounded-lg flex items-center gap-3 ml-auto">
            <span className="material-symbols-outlined text-primary text-[18px]">history</span>
            <p className="text-label-md text-on-surface-variant">Retention Policy: <span className="text-on-surface font-semibold">7 Years</span></p>
          </div>
        </div>
      </div>

      {/* Event Detail Side Drawer */}
      {selectedLog && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background-deep/50 z-[50]"
            onClick={() => setSelectedLog(null)}
          ></div>

          <div className="fixed inset-y-0 right-0 w-[480px] bg-surface-container-high shadow-[-10px_0_40px_rgba(0,0,0,0.5)] border-l border-outline-variant z-[60] flex flex-col animate-[slideInRight_0.3s_cubic-bezier(0.4,0,0.2,1)]">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-highest">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <div>
                  <h4 className="font-headline-sm text-headline-sm">Event Details</h4>
                </div>
              </div>
              <button
                className="p-2 hover:bg-surface-variant rounded-full transition-colors"
                onClick={() => setSelectedLog(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              {/* Metadata Section */}
              <section>
                <h5 className="text-[10px] uppercase font-bold tracking-widest text-outline mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span> Metadata
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-surface-variant/20 border border-outline-variant/30">
                    <p className="text-[10px] text-outline uppercase font-semibold">User</p>
                    <p className="font-label-md mt-1">{selectedLog.user.name}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-variant/20 border border-outline-variant/30">
                    <p className="text-[10px] text-outline uppercase font-semibold">Action</p>
                    <p className={`font-label-md mt-1 ${actionColors[selectedLog.action]?.split(' ')[1] || 'text-on-surface'}`}>{selectedLog.action}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-variant/20 border border-outline-variant/30">
                    <p className="text-[10px] text-outline uppercase font-semibold">Entity</p>
                    <p className="font-label-md mt-1">{selectedLog.entity}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-variant/20 border border-outline-variant/30">
                    <p className="text-[10px] text-outline uppercase font-semibold">Timestamp</p>
                    <p className="font-mono-md mt-1 text-[12px]">{new Date(selectedLog.timestamp).toISOString()}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Actions Footer */}
            <div className="p-6 bg-surface-container-highest border-t border-outline-variant flex gap-3">
              <button
                onClick={handleExport}
                className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-label-md hover:brightness-110 transition-all"
              >
                Download Log
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
