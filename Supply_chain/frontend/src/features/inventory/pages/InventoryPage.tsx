import React, { useState } from 'react';
import { useGetInventoryQuery, useGetInventoryKpisQuery, useInitiateRestockMutation, type InventoryItem } from '../api/inventoryApi';
import { Layout } from '../../../components/layout/Layout';

export const InventoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  const { data: inventoryData, isLoading } = useGetInventoryQuery({ search, page, limit });
  const { data: kpiData } = useGetInventoryKpisQuery();
  const [initiateRestock] = useInitiateRestockMutation();

  const handleResetFilters = () => {
    setSearch('');
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-status-success/10 text-status-success border-status-success/20';
      case 'Low Stock': return 'bg-status-warning/20 text-status-warning border-status-warning/30';
      case 'Stockout': return 'bg-status-critical/20 text-status-critical border-status-critical/30';
      default: return 'bg-surface-variant/30 text-on-surface-variant';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-status-success';
      case 'Low Stock': return 'bg-status-warning';
      case 'Stockout': return 'bg-status-critical animate-pulse';
      default: return 'bg-surface-variant';
    }
  };

  const getRowClass = (status: string) => {
    switch (status) {
      case 'Stockout': return 'bg-status-critical/10 hover:bg-status-critical/20';
      case 'Low Stock': return 'bg-status-warning/5 hover:bg-status-warning/10';
      default: return 'hover:bg-surface-variant/30';
    }
  };

  const handleExportCSV = () => {
    const itemsToExport = inventoryData?.data || [];
    if (!itemsToExport.length) return;

    const headers = ['SKU', 'Description', 'Warehouse', 'Current Qty', 'Safety Stock', 'Status'];
    const rows = itemsToExport.map(item => [
      item.sku,
      `"${item.description.replace(/"/g, '""')}"`,
      `"${item.warehouse.replace(/"/g, '""')}"`,
      item.currentQty,
      item.safetyStock,
      item.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestock = async (sku: string) => {
    try {
      await initiateRestock(sku).unwrap();
      // In a real app we might show a toast here
    } catch (e) {
      console.error('Failed to restock', e);
    }
  };

  const items = inventoryData?.data || [];
  const meta = inventoryData?.meta;
  const selectedItem = items.find(i => i.sku === selectedSku);

  return (
    <Layout pageTitle="Inventory Monitoring">
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar bg-background">
        <div className="flex-1 p-margin-desktop overflow-y-auto">
          {/* Header Area */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Inventory Monitoring</h2>
              <p className="text-on-surface-variant">Real-time visibility across global warehouses and fulfillment nodes.</p>
            </div>
            <button 
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
              onClick={handleExportCSV}
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>

          {/* Summary Cards (KPIs) */}
          <div className="grid grid-cols-12 gap-gutter mb-8">
            <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-xl animate-kpi" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Total SKUs</span>
                <span className="material-symbols-outlined text-primary">inventory</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-display-lg text-on-surface">
                  {kpiData ? kpiData.data.totalSkus.toLocaleString() : '...'}
                </span>
                <span className="text-status-success font-label-md text-label-md flex items-center">+1.2%</span>
              </div>
              <div className="mt-4 h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4"></div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-xl animate-kpi" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Low Stock Items</span>
                <span className="material-symbols-outlined text-status-warning">warning</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-display-lg text-on-surface">
                  {kpiData ? kpiData.data.lowStockItems.toLocaleString() : '...'}
                </span>
                <span className="text-status-critical font-label-md text-label-md flex items-center">-14%</span>
              </div>
              <div className="mt-4 h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-status-warning w-1/4"></div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-xl animate-kpi" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Excess Stock</span>
                <span className="material-symbols-outlined text-tertiary">layers</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-display-lg text-on-surface">
                  {kpiData ? kpiData.data.excessStock.toLocaleString() : '...'}
                </span>
                <span className="text-on-surface-variant font-label-md text-label-md flex items-center">Stable</span>
              </div>
              <div className="mt-4 h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-tertiary w-1/2"></div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex">
            <div className="relative group w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                className="bg-surface-container-high border-none rounded-full pl-10 pr-6 py-2 w-full text-body-md focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                placeholder="Search by SKU or Name..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {search && (
              <button
                className="ml-4 px-4 py-2 bg-surface-variant/30 hover:bg-surface-variant/50 text-on-surface rounded-lg transition-colors font-label-md text-label-md"
                onClick={handleResetFilters}
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Data Table Container */}
          <div className="glass-card rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high/50 border-b border-border-subtle sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">SKU</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Warehouse</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Current Qty</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Safety Stock</th>
                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/30">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-48 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-32 bg-surface-variant rounded-full"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 bg-surface-variant rounded-full ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 bg-surface-variant rounded-full ml-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-variant rounded-full"></div></td>
                      </tr>
                    ))
                  ) : items.length > 0 ? (
                    items.map((item) => (
                      <tr
                        key={item._id}
                        className={`${getRowClass(item.status)} transition-colors cursor-pointer group`}
                      >
                        <td className="px-6 py-4 font-mono-md text-mono-md text-primary">{item.sku}</td>
                        <td className="px-6 py-4 text-on-surface font-medium">{item.description}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{item.warehouse}</td>
                        <td className={`px-6 py-4 text-right font-bold ${item.status === 'Stockout' ? 'text-status-critical' : item.status === 'Low Stock' ? 'text-status-warning' : 'text-status-success'}`}>
                          {item.currentQty.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-on-surface-variant">{item.safetyStock.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-label-md text-label-md ${getStatusColor(item.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`}></span>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No items found</h3>
                          <p className="text-on-surface-variant max-w-sm mb-6">No inventory items matching your current filters.</p>
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
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, meta.total)} of {meta.total} items
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
        </div>

        {/* Right Sidebar (Collapsible Details) */}
        <div className={`fixed right-0 top-0 h-full w-96 bg-surface-container shadow-2xl border-l border-border-subtle z-50 transition-transform duration-300 ease-in-out ${selectedSku ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-border-subtle flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">SKU Details</h3>
              <button
                className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
                onClick={() => setSelectedSku(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {selectedItem && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-8">
                  <div className="w-full h-48 rounded-xl overflow-hidden border border-border-subtle mb-4">
                    <img
                      alt="Industrial Component"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2AoYHYrN_SHG6AuREhLQi1CHFuwX92SFMxTQQYJSXs_xGxsgcmJaZtjWYMiq5jmT6SDDcWmQY5MDU49LyevtBZY-9nCOeREmImeYrEjj4jMnwS6E0m1Zi6gGFtAbBIDneKoZpaNaC7YJejZ-0SQhmYH1IZShiZ94BJjmFe_yoRtno84oULU-K1sljXz-HgL76YPrCXT1rd1Ycm6kgfZ5W8KZgc-Ewqj1Kdb908MkKWPoG1G0HtROhuY6o9wEZMuwnlWRZ0YjneiI"
                    />
                  </div>
                  <span className="font-mono-md text-mono-md text-primary block mb-1">{selectedItem.sku}</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight mb-4">{selectedItem.description}</h4>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest block mb-2">AI Demand Forecast (Next 30 Days)</span>
                    <div className="glass-card h-40 rounded-lg p-4 flex items-end gap-1 overflow-hidden relative group">
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-primary animate-pulse">
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        <span className="font-label-md text-label-md">Predictive Analysis Active</span>
                      </div>

                      {selectedItem.demandForecast.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm"
                          style={{ height: `${val}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 rounded-lg">
                      <span className="text-on-surface-variant font-label-md block mb-1">Lead Time</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">{selectedItem.leadTime} Days</span>
                    </div>
                    <div className="glass-card p-4 rounded-lg">
                      <span className="text-on-surface-variant font-label-md block mb-1">Reorder Point</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">{selectedItem.reorderPoint} Units</span>
                    </div>
                  </div>

                  {selectedItem.status !== 'In Stock' && (
                    <button
                      onClick={() => handleRestock(selectedItem.sku)}
                      className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg flex justify-center items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-primary/20"
                    >
                      <span className="material-symbols-outlined">shopping_cart_checkout</span>
                      Initiate Emergency Restock
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
