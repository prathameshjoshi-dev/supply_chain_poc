import React, { useState } from 'react';
import { useGetShipmentsQuery } from '../api/shipmentsApi';
import { Layout } from '../../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';

export const ShipmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Statuses');
  const [carrier, setCarrier] = useState('All Carriers');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetShipmentsQuery({
    page,
    limit,
    search,
    status,
    carrier,
  });

  const shipments = data?.data || [];
  const meta = data?.meta;

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All Statuses');
    setCarrier('All Carriers');
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In-Transit': return 'text-primary bg-primary/10';
      case 'Delayed': return 'text-status-warning bg-status-warning/10';
      case 'Delivered': return 'text-status-success bg-status-success/10';
      case 'Critical': return 'text-status-critical bg-status-critical/10';
      default: return 'text-on-surface-variant bg-surface-variant/30';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date).replace(',', '');
    } catch {
      return dateString;
    }
  };

  return (
    <Layout pageTitle="Shipment Tracking">
      <div className="flex-1 flex flex-col h-full bg-background-deep overflow-hidden pt-6">
        {/* Filter Bar */}
        <section className="px-8 pb-6 shrink-0 flex justify-between items-start gap-4">
          <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-4 flex-1">
            <div className="flex-1 flex gap-4 min-w-[600px]">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1">Search</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-lg">search</span>
                  <input
                    className="w-full bg-surface-container-low border border-border-subtle rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
                    placeholder="ID or Destination..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 w-40">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1">Status</label>
                <select
                  className="bg-surface-container-low border border-border-subtle rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-body-md text-on-surface"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>In-Transit</option>
                  <option>Delivered</option>
                  <option>Delayed</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-48">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1">Carrier</label>
                <select
                  className="bg-surface-container-low border border-border-subtle rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-body-md text-on-surface"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                >
                  <option>All Carriers</option>
                  <option>Apex Logistics</option>
                  <option>Global Freight</option>
                  <option>QuickShip Inc.</option>
                  <option>Express Route</option>
                  <option>SkyPort Cargo</option>
                  <option>Euro Trans</option>
                </select>
              </div>
              {/* <div className="flex flex-col gap-1.5 w-56">
              <label className="font-label-md text-label-md text-on-surface-variant ml-1">Date Range</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-lg">calendar_today</span>
                <input className="w-full bg-surface-container-low border border-border-subtle rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-body-md text-on-surface" placeholder="Oct 01 - Oct 31" type="text"/>
              </div>
            </div> */}
            </div>
            <div className="flex items-center gap-2 self-end pb-0.5">
              {/* <button className="p-2 border border-border-subtle rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button> */}
              <button
                className="px-4 py-2 bg-surface-variant/30 hover:bg-surface-variant/50 text-on-surface rounded-lg transition-colors font-label-md text-label-md"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate('/shipments/new')}
            className="flex shrink-0 items-center gap-2 bg-primary text-on-primary-container px-6 py-3 rounded-xl font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add_circle</span>
            New Shipment
          </button>
        </section>

        {/* Main Data Area */}
        <section className="flex-1 px-8 overflow-hidden pb-8">
          <div className="glass-card rounded-2xl h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="table-sticky-header bg-surface-container-high/90">
                  <tr className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-border-subtle">
                    <th className="px-6 py-4 font-semibold group cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center gap-2">
                        Shipment ID
                        <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">unfold_more</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 font-semibold group cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center gap-2">
                        Status
                        <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">unfold_more</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 font-semibold group cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center gap-2">
                        ETA
                        <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">unfold_more</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 font-semibold">Origin</th>
                    <th className="px-6 py-4 font-semibold">Destination</th>
                    <th className="px-6 py-4 font-semibold">Carrier</th>
                    <th className="px-6 py-4 font-semibold">Last Update</th>
                    <th className="px-6 py-4 font-semibold text-center w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {(isLoading || isFetching) ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-border-subtle/30">
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-variant rounded-lg"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-28 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-32 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-32 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-32 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-8 w-8 bg-surface-variant rounded-full mx-auto"></div></td>
                      </tr>
                    ))
                  ) : shipments.length > 0 ? (
                    shipments.map((s) => (
                      <tr key={s._id} className="group border-b border-border-subtle/30 hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-mono-md text-mono-md text-on-surface group-hover:text-primary transition-colors">{s.shipmentId}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-label-md text-[10px] uppercase tracking-wider ${getStatusColor(s.status)}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface font-medium">{formatDate(s.eta)}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{s.origin}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{s.destination}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{s.carrier}</td>
                        <td className="px-6 py-4 text-on-surface-variant italic opacity-80">{formatDate(s.lastUpdate)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No shipments found</h3>
                          <p className="text-on-surface-variant max-w-sm mb-6">No shipments found matching your current filters. Try adjusting your search criteria.</p>
                          <button
                            className="text-primary font-label-md text-label-md border border-primary/30 px-6 py-2 rounded-lg hover:bg-primary/5 transition-all"
                            onClick={handleResetFilters}
                          >
                            Reset All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <footer className="bg-surface-container-high/50 border-t border-border-subtle p-4 flex justify-between items-center shrink-0">
                <span className="text-on-surface-variant font-label-md text-label-md">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, meta.total)} of {meta.total} shipments
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors disabled:opacity-20"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: meta.totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-label-md text-label-md ${page === i + 1 ? 'bg-primary text-on-primary-container' : 'hover:bg-surface-variant/50 text-on-surface-variant'}`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className="p-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors disabled:opacity-20"
                    disabled={page === meta.totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </footer>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};
