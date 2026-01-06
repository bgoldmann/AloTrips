'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, MousePointerClick, DollarSign, Target, Download, 
  Calendar, Filter, BarChart3, PieChart as PieChartIcon 
} from 'lucide-react';

interface AffiliateMetrics {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenue: number;
  epc: number;
}

interface ProviderPerformance {
  provider: string;
  clicks: number;
  conversions: number;
  revenue: number;
  epc: number;
  conversionRate: number;
}

interface PlacementPerformance {
  placement: string;
  clicks: number;
  conversions: number;
  revenue: number;
  epc: number;
  conversionRate: number;
}

interface RevenueHistory {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
  epc: number;
}

const COLORS = ['#f97316', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function AffiliateDashboard() {
  const [metrics, setMetrics] = useState<AffiliateMetrics | null>(null);
  const [providerPerformance, setProviderPerformance] = useState<ProviderPerformance[]>([]);
  const [placementPerformance, setPlacementPerformance] = useState<PlacementPerformance[]>([]);
  const [revenueHistory, setRevenueHistory] = useState<RevenueHistory[]>([]);
  const [clicksByVertical, setClicksByVertical] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/admin/affiliate/stats?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setProviderPerformance(data.providerPerformance || []);
        setPlacementPerformance(data.placementPerformance || []);
        setRevenueHistory(data.revenueHistory || []);
        setClicksByVertical(data.clicksByVertical || {});
      }
    } catch (error) {
      console.error('Failed to fetch affiliate stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const data = {
      metrics,
      providerPerformance,
      placementPerformance,
      revenueHistory,
      clicksByVertical,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Export provider performance as CSV
    const headers = ['Provider', 'Clicks', 'Conversions', 'Revenue', 'EPC', 'Conversion Rate'];
    const rows = providerPerformance.map(p => [
      p.provider,
      p.clicks,
      p.conversions,
      p.revenue.toFixed(2),
      p.epc.toFixed(4),
      p.conversionRate.toFixed(2) + '%',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-provider-performance-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || !metrics) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading affiliate dashboard...</div>
      </div>
    );
  }

  // Prepare data for pie chart (clicks by vertical)
  const verticalChartData = Object.entries(clicksByVertical).map(([vertical, clicks]) => ({
    name: vertical,
    value: clicks,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Affiliate Dashboard</h1>
              <p className="text-gray-600">Track clicks, conversions, and revenue performance</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold"
              >
                <Download size={16} />
                Export JSON
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
            <Calendar size={18} className="text-gray-400" />
            <div className="flex items-center gap-3">
              <div>
                <label htmlFor="affiliate-start-date" className="text-xs text-gray-500 mb-1 block">Start Date</label>
                <input
                  id="affiliate-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                />
              </div>
              <div>
                <label htmlFor="affiliate-end-date" className="text-xs text-gray-500 mb-1 block">End Date</label>
                <input
                  id="affiliate-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-500">Total Clicks</span>
              <MousePointerClick size={20} className="text-orange-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">{metrics.totalClicks.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-500">Conversions</span>
              <Target size={20} className="text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">{metrics.totalConversions.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-500">Conversion Rate</span>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">{metrics.conversionRate.toFixed(2)}%</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-500">Total Revenue</span>
              <DollarSign size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-500">EPC</span>
              <BarChart3 size={20} className="text-purple-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">${metrics.epc.toFixed(4)}</p>
          </div>
        </div>

        {/* Charts Row 1: Revenue History & Clicks by Vertical */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue History Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue & Clicks History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis 
                  yAxisId="left" 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value: number | undefined) => `$${(value || 0).toLocaleString()}`}
                />
                <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }} 
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.2}
                  name="Revenue ($)"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#f97316" 
                  fill="#f97316" 
                  fillOpacity={0.2}
                  name="Clicks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Clicks by Vertical Pie Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Clicks by Vertical</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={verticalChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {verticalChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Performance Table */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Provider Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Provider</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Clicks</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Conversions</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">EPC</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {providerPerformance.map((provider, index) => (
                  <tr key={provider.provider} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-900">{provider.provider}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{provider.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{provider.conversions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">${provider.revenue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">${provider.epc.toFixed(4)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{provider.conversionRate.toFixed(2)}%</td>
                  </tr>
                ))}
                {providerPerformance.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No provider data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placement Performance Table */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Placement Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Placement</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Clicks</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Conversions</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">EPC</th>
                  <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {placementPerformance.map((placement) => (
                  <tr key={placement.placement} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-gray-900 capitalize">
                      {placement.placement.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">{placement.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{placement.conversions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">${placement.revenue.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">${placement.epc.toFixed(4)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{placement.conversionRate.toFixed(2)}%</td>
                  </tr>
                ))}
                {placementPerformance.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No placement data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provider Performance Bar Chart */}
        {providerPerformance.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Provider Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={providerPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="provider" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }} 
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                <Bar dataKey="clicks" fill="#f97316" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

