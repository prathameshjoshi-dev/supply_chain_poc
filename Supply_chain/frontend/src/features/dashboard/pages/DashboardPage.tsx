import React from 'react';
import { Layout } from '../../../components/layout/Layout';
import { useGetKpisQuery } from '../api/dashboardApi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { data: kpiData, isLoading } = useGetKpisQuery();

  return (
    <Layout pageTitle="Dashboard">
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header / Stale Data Warning */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-title-lg text-on-surface">Overview</h1>
            <p className="text-on-surface-variant mt-1 font-body-md">High-level insights across your supply chain network.</p>
          </div>
          {kpiData?.data?.staleDataWarning && (
            <div className="bg-error-container text-on-error-container px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse shadow-sm">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span className="font-label-md">Stale Data Warning: Carrier feeds may be delayed.</span>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-label-md animate-pulse">Loading dashboard insights...</p>
          </div>
        ) : (
          <>
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard 
                title="Active Shipments" 
                value={kpiData?.data?.activeShipments || 0} 
                icon="local_shipping" 
                trend="+12%" 
                trendUp={true} 
              />
              <KpiCard 
                title="Delivery Success" 
                value={`${kpiData?.data?.shipmentSuccessRate || 0}%`} 
                icon="check_circle" 
                trend="+2%" 
                trendUp={true} 
              />
              <KpiCard 
                title="Pending Workflows" 
                value={kpiData?.data?.pendingWorkflows || 0} 
                icon="task" 
                trend="-5%" 
                trendUp={false} 
              />
              <KpiCard 
                title="Low Stock Alerts" 
                value={kpiData?.data?.lowStockAlerts || 0} 
                icon="warning" 
                trend="+3" 
                trendUp={false} 
                alert={kpiData?.data?.lowStockAlerts ? true : false}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Main Trend Chart */}
              <div className="bg-surface-glass backdrop-blur-md rounded-3xl p-6 border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-title-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                  Shipment Volume Trends
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kpiData?.data?.shipmentTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="name" stroke="currentColor" className="text-on-surface-variant text-xs" tickLine={false} axisLine={false} />
                      <YAxis stroke="currentColor" className="text-on-surface-variant text-xs" tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                        contentStyle={{backgroundColor: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} 
                      />
                      <Bar dataKey="value" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Efficiency Chart */}
              <div className="bg-surface-glass backdrop-blur-md rounded-3xl p-6 border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-title-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">bolt</span>
                  Workflow Efficiency
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpiData?.data?.workflowTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="name" stroke="currentColor" className="text-on-surface-variant text-xs" tickLine={false} axisLine={false} />
                      <YAxis stroke="currentColor" className="text-on-surface-variant text-xs" tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        contentStyle={{backgroundColor: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}} 
                      />
                      <Line type="monotone" dataKey="value" stroke="#34D399" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-surface-glass backdrop-blur-md rounded-3xl p-6 border border-border-subtle shadow-sm mt-8">
              <h3 className="text-lg font-title-md text-on-surface mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {kpiData?.data?.recentActivity?.length ? (
                  kpiData.data.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-surface-variant rounded-xl transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sm">notifications</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-on-surface font-body-md">{item.message}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{new Date(item.time).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant font-body-sm">No recent activity.</p>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </Layout>
  );
};

// Sub-component for KPI Card
const KpiCard = ({ title, value, icon, trend, trendUp, alert }: { title: string, value: string | number, icon: string, trend: string, trendUp: boolean, alert?: boolean }) => {
  return (
    <div className={`relative overflow-hidden bg-surface-glass backdrop-blur-md rounded-3xl p-6 border border-border-subtle shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group`}>
      {/* Decorative gradient blob */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40 ${alert ? 'bg-error' : 'bg-primary'}`}></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-label-md text-on-surface-variant uppercase tracking-wider mb-2">{title}</p>
          <h2 className={`text-4xl font-title-lg tracking-tight ${alert ? 'text-error' : 'text-on-surface'}`}>{value}</h2>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${alert ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'} shadow-inner`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex items-center gap-2">
        <div className={`flex items-center gap-1 text-xs font-label-md px-2 py-1 rounded-md ${trendUp ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          <span className="material-symbols-outlined text-[14px]">
            {trendUp ? 'trending_up' : 'trending_down'}
          </span>
          {trend}
        </div>
        <span className="text-xs text-on-surface-variant font-body-sm">vs last week</span>
      </div>
    </div>
  );
};
