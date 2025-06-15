import { BarChart3, PieChart, Users, Clock, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
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
    type: 'pie',
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
        backgroundColor: '#3b82f6',
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
          tension: 0.4
        },
        {
          label: 'Furniture',
          data: [100, 85, 70, 60, 50],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Vehicles',
          data: [100, 70, 50, 35, 25],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4
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

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AssetFlow Enterprise</h1>
            <p className="text-slate-300 mt-1">Comprehensive Asset Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Assets"
          value={mockMetrics.totalAssets.toLocaleString()}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <MetricCard
          title="Active Assets"
          value={mockMetrics.activeAssets.toLocaleString()}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <MetricCard
          title="Total Value"
          value={`$${(mockMetrics.totalValue / 1000000).toFixed(1)}M`}
          icon={BarChart3}
          trend={{ value: 5, isPositive: true }}
          color="purple"
        />
        <MetricCard
          title="Monthly Depreciation"
          value="$12.5K"
          icon={TrendingDown}
          trend={{ value: -2.1, isPositive: false }}
          color="red"
        />
      </div>

      {/* Alert Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Pending Audits"
          value={mockMetrics.pendingAudits}
          icon={Clock}
          color="yellow"
        />
        <MetricCard
          title="Overdue Audits"
          value={mockMetrics.overdueAudits}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Maintenance Required"
          value={mockMetrics.maintenanceRequired}
          icon={Users}
          color="yellow"
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <ChartCard
          title="Asset State Summary"
          icon={<PieChart className="w-5 h-5 text-blue-600" />}
          chartConfig={assetStateConfig}
        />
        <ChartCard
          title="Ownership Changes"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          chartConfig={ownershipChangesConfig}
        />
        <ChartCard
          title="Depreciation Curves"
          icon={<TrendingDown className="w-5 h-5 text-blue-600" />}
          chartConfig={depreciationConfig}
          className="lg:col-span-2 xl:col-span-1"
        />
      </div>
    </>
  );
}