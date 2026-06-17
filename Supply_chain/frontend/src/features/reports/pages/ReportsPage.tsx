import React, { useState } from 'react';
import { useGetScheduledReportsQuery, useGetRecentDownloadsQuery, useGenerateReportMutation, useClearRecentDownloadsMutation } from '../api/reportsApi';
import { Layout } from '../../../components/layout/Layout';

export const ReportsPage: React.FC = () => {
  const { data: scheduledData, isLoading: isScheduledLoading } = useGetScheduledReportsQuery();
  const { data: downloadsData, isLoading: isDownloadsLoading } = useGetRecentDownloadsQuery();
  const [generateReport, { isLoading: isGenerating }] = useGenerateReportMutation();
  const [clearRecentDownloads, { isLoading: isClearing }] = useClearRecentDownloadsMutation();

  const [dateRange, setDateRange] = useState('Oct 01, 2023 - Oct 31, 2023');
  const [format, setFormat] = useState('pdf');
  const [warehouses, setWarehouses] = useState<string[]>(['Global Operations (All)']);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await generateReport({ format, dateRange, warehouses }).unwrap();

      // Simulate downloading the generated report
      let fileContent = '';
      let mimeType = '';
      if (format === 'csv') {
        fileContent = 'Report generated successfully\nColumn 1,Column 2\nData 1,Data 2';
        mimeType = 'text/csv';
      } else {
        fileContent = 'PDF Report Placeholder Content...';
        mimeType = 'application/pdf';
      }

      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.data.name || `report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Failed to generate report', err);
    }
  };

  const handleDownloadOldReport = (name: string, type: string) => {
    let fileContent = '';
    let mimeType = '';
    if (type === 'csv') {
      fileContent = 'Report generated successfully\nColumn 1,Column 2\nData 1,Data 2';
      mimeType = 'text/csv';
    } else {
      fileContent = 'PDF Report Placeholder Content...';
      mimeType = 'application/pdf';
    }
    
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout pageTitle='Reports & Analytics'>
      <div className="p-margin-desktop space-y-gutter max-w-container-max mx-auto">
        {/* Header Title */}
        <div className="flex justify-between items-end">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Reports & Analytics</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl">
              Orchestrate data insights across global supply chain nodes. Generate, schedule, and audit performance metrics with precision.
            </p>
          </div>
          {/* <div className="flex gap-3">
            <button className="px-4 py-2 bg-surface-variant text-on-surface font-label-md text-label-md rounded hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter View
            </button>
          </div> */}
        </div>

        {/* Report Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* KPI 1 */}
          <div className="glass-card p-6 rounded-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl">local_shipping</span>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 border border-primary/20">
                <span className="material-symbols-outlined text-primary">monitoring</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Shipment Performance</h3>
              <p className="text-on-surface-variant text-body-md mt-1">Average transit times & carrier reliability scores.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-status-success text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span> +4.2%
                </span>
                <button className="text-primary hover:underline font-label-md">Select</button>
              </div>
            </div>
          </div>
          {/* KPI 2 */}
          <div className="glass-card p-6 rounded-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl">inventory</span>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 border border-secondary/20">
                <span className="material-symbols-outlined text-secondary">database</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Inventory Snapshot</h3>
              <p className="text-on-surface-variant text-body-md mt-1">Stock levels across regional hubs and lead time drift.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-status-warning text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_flat</span> Stable
                </span>
                <button className="text-primary hover:underline font-label-md">Select</button>
              </div>
            </div>
          </div>
          {/* KPI 3 */}
          <div className="glass-card p-6 rounded-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl">account_tree</span>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-tertiary-container/10 rounded-lg flex items-center justify-center mb-4 border border-tertiary-container/20">
                <span className="material-symbols-outlined text-tertiary-container">cyclone</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Workflow Summary</h3>
              <p className="text-on-surface-variant text-body-md mt-1">Efficiency analysis of automated logistics routes.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-status-success text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">bolt</span> Efficient
                </span>
                <button className="text-primary hover:underline font-label-md">Select</button>
              </div>
            </div>
          </div>
          {/* KPI 4 */}
          <div className="glass-card p-6 rounded-xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl">policy</span>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-on-secondary-container/10 rounded-lg flex items-center justify-center mb-4 border border-on-secondary-container/20">
                <span className="material-symbols-outlined text-on-secondary-container">assignment_turned_in</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Audit Log</h3>
              <p className="text-on-surface-variant text-body-md mt-1">Detailed history of administrative actions & overrides.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-on-surface-variant text-label-md">2.4k entries</span>
                <button className="text-primary hover:underline font-label-md">Select</button>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Report Form & Scheduled Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Report Configuration Form */}
          <section className="lg:col-span-4 glass-card rounded-xl p-6 border-l-4 border-l-primary/40">
            <h3 className="font-headline-md text-headline-md mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">settings_applications</span>
              Generate Report
            </h3>
            <form className="space-y-6" onSubmit={handleGenerate}>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">Date Range</label>
                <div className="relative group">
                  <input
                    className="w-full bg-surface-container-highest/30 border border-border-subtle rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_month</span>
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">Warehouse / Region</label>
                <select
                  className="w-full bg-surface-container-highest/30 border border-border-subtle rounded-lg px-4 py-3 text-body-md focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all h-32"
                  multiple
                  value={warehouses}
                  onChange={(e) => setWarehouses(Array.from(e.target.selectedOptions, option => option.value))}
                >
                  <option value="Global Operations (All)">Global Operations (All)</option>
                  <option value="North America - Hub A1">North America - Hub A1</option>
                  <option value="EMEA - Berlin Logistics">EMEA - Berlin Logistics</option>
                  <option value="APAC - Singapore Central">APAC - Singapore Central</option>
                  <option value="LATAM - São Paulo Hub">LATAM - São Paulo Hub</option>
                </select>
                <p className="text-[10px] text-on-surface-variant mt-2 italic">Hold Ctrl/Cmd to multi-select</p>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-3 uppercase tracking-wider">Export Format</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <input
                      checked={format === 'pdf'}
                      onChange={() => setFormat('pdf')}
                      className="hidden peer"
                      name="format"
                      type="radio"
                      value="pdf"
                    />
                    <div className="flex flex-col items-center p-4 border border-border-subtle rounded-lg bg-surface-container/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                      <span className="material-symbols-outlined text-3xl mb-2 text-on-surface-variant group-hover:scale-110 transition-transform">picture_as_pdf</span>
                      <span className="font-label-md text-label-md">PDF Document</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input
                      className="hidden peer"
                      checked={format === 'csv'}
                      onChange={() => setFormat('csv')}
                      name="format"
                      type="radio"
                      value="csv"
                    />
                    <div className="flex flex-col items-center p-4 border border-border-subtle rounded-lg bg-surface-container/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                      <span className="material-symbols-outlined text-3xl mb-2 text-on-surface-variant group-hover:scale-110 transition-transform">csv</span>
                      <span className="font-label-md text-label-md">CSV Spreadsheet</span>
                    </div>
                  </label>
                </div>
              </div>
              <button
                disabled={isGenerating}
                className="w-full bg-primary text-on-primary-container font-headline-sm text-headline-sm py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                type="submit"
              >
                {isGenerating ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined">auto_graph</span>
                )}
                {isGenerating ? 'Processing...' : 'Generate Report'}
              </button>
            </form>
          </section>

          {/* Scheduled Reports Table & Downloads */}
          <div className="lg:col-span-8 space-y-gutter">
            {/* Scheduled Reports */}
            <section className="glass-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-high/20">
                <h3 className="font-headline-md text-headline-md flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">schedule</span>
                  Scheduled Reports
                </h3>
                <button className="text-primary text-label-md hover:underline">Manage All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-high/40 text-on-surface-variant font-label-md text-label-md">
                    <tr>
                      <th className="px-6 py-4">Report Name</th>
                      <th className="px-6 py-4">Frequency</th>
                      <th className="px-6 py-4">Next Run</th>
                      <th className="px-6 py-4">Recipients</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-md divide-y divide-border-subtle/50">
                    {isScheduledLoading ? (
                      <tr><td colSpan={5} className="p-4 text-center text-on-surface-variant">Loading...</td></tr>
                    ) : scheduledData?.data?.map((report) => (
                      <tr key={report._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-5 font-semibold text-on-surface">{report.name}</td>
                        <td className="px-6 py-5 text-on-surface-variant">{report.frequency}</td>
                        <td className={`px-6 py-5 ${report.status === 'Active' ? 'text-primary' : 'text-on-surface-variant'}`}>{report.nextRun}</td>
                        <td className="px-6 py-5">
                          <div className="flex -space-x-2">
                            {report.recipients.map((rec, i) => (
                              <div key={i} className={`w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-[10px] ${i === 0 ? 'bg-surface-variant' : 'bg-primary/20 text-primary'}`}>
                                {rec}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {report.status === 'Active' ? (
                            <span className="px-3 py-1 rounded-full bg-status-success/10 text-status-success text-[11px] font-bold uppercase tracking-wider">Active</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Paused</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Downloads Section */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">cloud_download</span>
                  Recent Downloads
                </h3>
                <button 
                  onClick={() => clearRecentDownloads()}
                  disabled={isClearing}
                  className="px-3 py-1 rounded-lg border border-border-subtle hover:bg-surface-variant text-label-md transition-colors disabled:opacity-50"
                >
                  {isClearing ? 'Clearing...' : 'Clear History'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isDownloadsLoading ? (
                  <div className="text-on-surface-variant">Loading...</div>
                ) : downloadsData?.data?.map((download) => (
                  <div key={download._id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container/50 border border-border-subtle hover:translate-x-1 transition-transform">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${download.type === 'pdf' ? 'bg-status-success/10' : 'bg-status-warning/10'}`}>
                      <span className={`material-symbols-outlined ${download.type === 'pdf' ? 'text-status-success' : 'text-status-warning'}`}>
                        {download.type === 'pdf' ? 'description' : 'table_view'}
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-label-md text-label-md text-on-surface truncate">{download.name}</p>
                      <p className="text-[11px] text-on-surface-variant">Generated {new Date(download.generatedAt).toLocaleString()} • {download.size}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDownloadOldReport(download.name, download.type)}
                        className="p-2 hover:bg-surface-variant rounded-lg text-primary" 
                        title="Download"
                      >
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};
