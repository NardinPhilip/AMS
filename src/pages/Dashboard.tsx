import { BarChart3, PieChart, Users, Clock, Package, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Activity, Zap, Shield, ClipboardCheck } from 'lucide-react';
import { ChartConfiguration } from 'chart.js/auto';

import Filters from '../components/Filters';
import LifecycleMetrics from '../components/LifecycleMetrics';
import ChartCard from '../components/ChartCard';
import MetricCard from '../components/MetricCard';
import { useFilteredData } from '../hooks/useFilteredData';
import { FilterType, BranchType, StatusType } from '../types/dashboard';
import { mockMetrics } from '../data/mockData';
import { useState } from 'react';

export default function Dashboard() {
  const [category, setCategory] = useState<FilterType>('all');
  const [branch, setBranch] = useState<BranchType>('all');
  const [status, setStatus] = useState<StatusType>('all');

  const filteredData = useFilteredData(category, branch, status);

  // Chart configurations
  const assetStateConfig: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: filteredData.assetStatus.map(item => item.status),
      datasets: [{
        data: filteredData.assetStatus.map(item => item.count),
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: { size: 12, weight: '500' }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  };

  const ownershipChangesConfig: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: filteredData.ownershipChanges.map(item => item.branch),
      datasets: [{
        label: 'Ownership Changes',
        data: filteredData.ownershipChanges.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#e2e8f0' },
          ticks: { font: { size: 12 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 } }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  };

  const depreciationConfig: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      datasets: [
        {
          label: 'Electronics',
          data: [100, 75, 55, 40, 25],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Furniture',
          data: [100, 85, 70, 60, 50],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Vehicles',
          data: [100, 70, 50, 35, 25],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: '#e2e8f0' },
          ticks: { 
            font: { size: 12 },
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 } }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: { size: 12, weight: '500' }
          }
        }
      }
    }
  };

  const assetValueTrendConfig: ChartConfiguration = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Asset Value ($M)',
        data: [2.1, 2.3, 2.2, 2.4, 2.6, 2.5, 2.7, 2.8, 2.6, 2.9, 3.0, 2.9],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: '#e2e8f0' },
          ticks: { font: { size: 12 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 } }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  };

  return (
    <>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">AssetFlow Enterprise</h1>
                <p className="text-blue-200 text-lg">Comprehensive Asset Management Dashboard</p>
                <div className="flex items-center space-x-6 mt-3 text-sm text-blue-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>System Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure Connection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Real-time Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white/80 text-sm mb-1">Last Updated</div>
              <div className="text-white font-semibold">{new Date().toLocaleString()}</div>
              <div className="mt-3 flex items-center space-x-2 text-green-300">
                <Zap className="w-4 h-4" />
                <span className="text-sm">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Assets"
          value={mockMetrics.totalAssets.toLocaleString()}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          color="blue"
          className="transform hover:scale-105 transition-all duration-300"
        />
        <MetricCard
          title="Active Assets"
          value={mockMetrics.activeAssets.toLocaleString()}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          color="green"
          className="transform hover:scale-105 transition-all duration-300"
        />
        <MetricCard
          title="Total Value"
          value={`$${(mockMetrics.totalValue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          trend={{ value: 5, isPositive: true }}
          color="purple"
          className="transform hover:scale-105 transition-all duration-300"
        />
        <MetricCard
          title="Monthly Depreciation"
          value="$12.5K"
          icon={TrendingDown}
          trend={{ value: -2.1, isPositive: true }}
          color="red"
          className="transform hover:scale-105 transition-all duration-300"
        />
      </div>

      {/* Enhanced Alert Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Pending Audits"
          value={mockMetrics.pendingAudits}
          icon={Clock}
          color="yellow"
          className="transform hover:scale-105 transition-all duration-300"
        />
        <MetricCard
          title="Overdue Audits"
          value={mockMetrics.overdueAudits}
          icon={AlertTriangle}
          color="red"
          className="transform hover:scale-105 transition-all duration-300"
        />
        <MetricCard
          title="Maintenance Required"
          value={mockMetrics.maintenanceRequired}
          icon={Users}
          color="yellow"
          className="transform hover:scale-105 transition-all duration-300"
        />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Filters
          category={category}
          branch={branch}
          status={status}
          onCategoryChange={setCategory}
          onBranchChange={setBranch}
          onStatusChange={setStatus}
        />
      </div>

      {/* Lifecycle Metrics */}
      <div className="mb-8">
        <LifecycleMetrics lifecycle={filteredData.lifecycle} />
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard
          title="Asset Distribution"
          icon={<PieChart className="w-5 h-5 text-blue-600" />}
          chartConfig={assetStateConfig}
          className="transform hover:scale-[1.02] transition-all duration-300"
        />
        <ChartCard
          title="Asset Value Trend"
          icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
          chartConfig={assetValueTrendConfig}
          className="transform hover:scale-[1.02] transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard
          title="Branch Activity"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          chartConfig={ownershipChangesConfig}
          className="transform hover:scale-[1.02] transition-all duration-300"
        />
        <ChartCard
          title="Depreciation Analysis"
          icon={<TrendingDown className="w-5 h-5 text-red-600" />}
          chartConfig={depreciationConfig}
          className="transform hover:scale-[1.02] transition-all duration-300"
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-3xl p-8 border border-blue-200 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-4 text-left transition-all duration-300 hover:shadow-lg group">
            <Package className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-semibold text-slate-900 mb-1">Add Asset</h3>
            <p className="text-sm text-slate-600">Register new equipment</p>
          </button>
          
          <button className="bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-4 text-left transition-all duration-300 hover:shadow-lg group">
            <ClipboardCheck className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-semibold text-slate-900 mb-1">Start Audit</h3>
            <p className="text-sm text-slate-600">Begin asset verification</p>
          </button>
          
          <button className="bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-4 text-left transition-all duration-300 hover:shadow-lg group">
            <Users className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-semibold text-slate-900 mb-1">Assign Assets</h3>
            <p className="text-sm text-slate-600">Manage assignments</p>
          </button>
          
          <button className="bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-400 rounded-xl p-4 text-left transition-all duration-300 hover:shadow-lg group">
            <BarChart3 className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-semibold text-slate-900 mb-1">View Reports</h3>
            <p className="text-sm text-slate-600">Generate analytics</p>
          </button>
        </div>
      </div>
    </>
  );
}