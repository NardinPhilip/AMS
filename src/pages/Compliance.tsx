import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, Calendar, FileText, Award } from 'lucide-react';
import MetricCard from '../components/MetricCard';

export default function Compliance() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const complianceItems = [
    {
      id: 'COMP-001',
      title: 'ISO 27001 Asset Management',
      category: 'Security',
      status: 'Compliant',
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      score: 98,
      requirements: 12,
      completed: 12,
      description: 'Information security management system compliance for asset tracking and protection.'
    },
    {
      id: 'COMP-002',
      title: 'SOX Financial Controls',
      category: 'Financial',
      status: 'Compliant',
      lastAudit: '2024-02-01',
      nextAudit: '2024-08-01',
      score: 95,
      requirements: 8,
      completed: 8,
      description: 'Sarbanes-Oxley compliance for financial asset reporting and controls.'
    },
    {
      id: 'COMP-003',
      title: 'GDPR Data Protection',
      category: 'Privacy',
      status: 'Action Required',
      lastAudit: '2024-01-20',
      nextAudit: '2024-04-20',
      score: 87,
      requirements: 15,
      completed: 13,
      description: 'General Data Protection Regulation compliance for asset-related personal data.'
    },
    {
      id: 'COMP-004',
      title: 'Environmental Compliance',
      category: 'Environmental',
      status: 'Non-Compliant',
      lastAudit: '2024-01-10',
      nextAudit: '2024-03-10',
      score: 72,
      requirements: 10,
      completed: 7,
      description: 'Environmental regulations for asset disposal and sustainability practices.'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? complianceItems 
    : complianceItems.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Action Required': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Non-Compliant': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'Action Required': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'Non-Compliant': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5 text-slate-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-600';
    if (score >= 85) return 'text-amber-600';
    return 'text-red-600';
  };

  const overallScore = Math.round(complianceItems.reduce((sum, item) => sum + item.score, 0) / complianceItems.length);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Compliance Dashboard</h1>
              <p className="text-slate-300 mt-1">Monitor regulatory compliance and audit status</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{overallScore}%</div>
            <div className="text-slate-300 text-sm">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Compliant Standards"
          value={complianceItems.filter(item => item.status === 'Compliant').length}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Action Required"
          value={complianceItems.filter(item => item.status === 'Action Required').length}
          icon={AlertTriangle}
          color="yellow"
        />
        <MetricCard
          title="Non-Compliant"
          value={complianceItems.filter(item => item.status === 'Non-Compliant').length}
          icon={XCircle}
          color="red"
        />
        <MetricCard
          title="Overall Score"
          value={`${overallScore}%`}
          icon={Award}
          color="blue"
        />
      </div>

      {/* Category Filter */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex items-center space-x-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Filter by Category</h2>
          <div className="flex-1"></div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            <option value="Security">Security</option>
            <option value="Financial">Financial</option>
            <option value="Privacy">Privacy</option>
            <option value="Environmental">Environmental</option>
          </select>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="space-y-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                {getStatusIcon(item.status)}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 mb-3">{item.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-500">Category: {item.category}</span>
                    <span className="text-sm text-slate-500">ID: {item.id}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <div className="mt-3">
                  <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                    {item.score}%
                  </div>
                  <div className="text-sm text-slate-500">Compliance Score</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Requirements</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {item.completed}/{item.requirements}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.completed / item.requirements) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Last Audit</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {new Date(item.lastAudit).toLocaleDateString()}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Next Audit</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {new Date(item.nextAudit).toLocaleDateString()}
                </div>
                {new Date(item.nextAudit) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                  <div className="text-xs text-amber-600 mt-1">Due Soon</div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                View Details
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Generate Report
              </button>
              {item.status !== 'Compliant' && (
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                  Take Action
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Timeline */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Compliance Deadlines</h2>
        <div className="space-y-4">
          {complianceItems
            .filter(item => new Date(item.nextAudit) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
            .sort((a, b) => new Date(a.nextAudit).getTime() - new Date(b.nextAudit).getTime())
            .map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">
                    {new Date(item.nextAudit).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-slate-600">
                    {Math.ceil((new Date(item.nextAudit).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}