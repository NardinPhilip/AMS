import { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Filter, 
  Plus, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Mail,
  Phone,
  Wrench,
  Building,
  TrendingUp,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { mockMaintenanceRequests, mockHelpDeskEmployees, mockVendors } from '../data/mockMainData';
import { MaintenanceRequest, HelpDeskEmployee, Vendor } from '../types';
import MetricCard from '../components/MetricCard';

export default function HelpDesk() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [employees, setEmployees] = useState<HelpDeskEmployee[]>(mockHelpDeskEmployees);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'requests' | 'team' | 'vendors'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const handleAssignRequest = (requestId: string, assigneeId: string, type: 'helpdesk' | 'vendor') => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, assignedTo: assigneeId, assignedType: type, status: 'in-progress' as const }
        : request
    ));
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Help Desk Portal</h1>
            <p className="text-slate-300 mt-1">Manage maintenance requests and support team</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl mb-8">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'requests', label: 'Requests', icon: Wrench },
            { id: 'team', label: 'Help Desk Team', icon: Users },
            { id: 'vendors', label: 'Vendors', icon: Building }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Requests"
              value={requests.length}
              icon={Wrench}
              color="blue"
            />
            <MetricCard
              title="Pending Requests"
              value={requests.filter(r => r.status === 'pending').length}
              icon={Clock}
              color="yellow"
            />
            <MetricCard
              title="In Progress"
              value={requests.filter(r => r.status === 'in-progress').length}
              icon={AlertTriangle}
              color="orange"
            />
            <MetricCard
              title="Completed Today"
              value={requests.filter(r => r.status === 'completed').length}
              icon={CheckCircle}
              color="green"
            />
          </div>

          {/* Team Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Workload</h3>
              <div className="space-y-4">
                {employees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{employee.name}</p>
                        <p className="text-sm text-slate-600">{employee.specialization.join(', ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{employee.workload}</p>
                      <p className="text-xs text-slate-600">active tasks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {requests.slice(0, 5).map(request => (
                  <div key={request.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      request.status === 'completed' ? 'bg-emerald-500' :
                      request.status === 'in-progress' ? 'bg-blue-500' :
                      request.status === 'pending' ? 'bg-amber-500' : 'bg-slate-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{request.title}</p>
                      <p className="text-xs text-slate-600">
                        {new Date(request.submittedDate).toLocaleDateString()} • 
                        <span className={`ml-1 capitalize ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {selectedTab === 'requests' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(request.status)}
                      <h3 className="text-lg font-semibold text-slate-900">{request.title}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{request.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Asset: {request.assetId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                        <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                          {new Date(request.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                      {request.cost && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">${request.cost}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="ml-4">
                      <select
                        onChange={(e) => {
                          const [type, id] = e.target.value.split(':');
                          if (type && id) {
                            handleAssignRequest(request.id, id, type as 'helpdesk' | 'vendor');
                          }
                        }}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        defaultValue=""
                      >
                        <option value="">Assign to...</option>
                        <optgroup label="Help Desk Team">
                          {employees.filter(emp => emp.available).map(employee => (
                            <option key={employee.id} value={`helpdesk:${employee.id}`}>
                              {employee.name} (Workload: {employee.workload})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="External Vendors">
                          {vendors.map(vendor => (
                            <option key={vendor.id} value={`vendor:${vendor.id}`}>
                              {vendor.name} (${vendor.hourlyRate}/hr)
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  )}
                </div>

                {request.assignedTo && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">
                      Assigned to: <span className="font-medium text-slate-900">
                        {request.assignedType === 'helpdesk' 
                          ? employees.find(emp => emp.id === request.assignedTo)?.name
                          : vendors.find(vendor => vendor.id === request.assignedTo)?.name
                        }
                      </span>
                      {request.assignedType === 'vendor' && ' (External Vendor)'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {selectedTab === 'team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(employee => (
              <div key={employee.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                      <p className="text-sm text-slate-600">{employee.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    employee.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.available ? 'Available' : 'Busy'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Specializations</p>
                    <div className="flex flex-wrap gap-1">
                      {employee.specialization.map(spec => (
                        <span key={spec} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Current Workload</span>
                    <span className="text-lg font-bold text-slate-900">{employee.workload}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {selectedTab === 'vendors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vendors.map(vendor => (
              <div key={vendor.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{vendor.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-500 fill-current' : 'text-slate-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">({vendor.rating})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">${vendor.hourlyRate}/hr</p>
                    <p className="text-sm text-slate-600">{vendor.responseTime}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{vendor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{vendor.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Specializations</p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialization.map(spec => (
                        <span key={spec} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}