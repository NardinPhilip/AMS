import { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  X,
  Upload,
  FileText,
  User,
  Package,
  Calendar,
  MessageSquare,
  Paperclip,
  Eye,
  Edit3,
  Trash2,
  Shield,
  DollarSign,
  Star,
  Phone,
  Mail,
  Users,
  Building2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { mockUsers, mockAssets, mockMaintenanceRequests, mockHelpDeskEmployees, mockVendors } from '../data/mockMainData';
import { User as UserType, Asset, MaintenanceRequest, MaintenanceAttachment, HelpDeskEmployee, Vendor } from '../types';
import FileUpload from './FileUpload';

export default function MaintenanceRequests() {
  const [users] = useState<UserType[]>(mockUsers);
  const [assets] = useState<Asset[]>(mockAssets);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [helpDeskEmployees] = useState<HelpDeskEmployee[]>(mockHelpDeskEmployees);
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    assetId: '',
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'hardware' as const
  });

  // Get current user (in a real app, this would come from auth context)
  const currentUser = users[0]; // Simulating logged-in user

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getAssetById = (assetId: string) => {
    return assets.find(asset => asset.id === assetId);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getHelpDeskEmployeeById = (id: string) => {
    return helpDeskEmployees.find(emp => emp.id === id);
  };

  const getVendorById = (id: string) => {
    return vendors.find(vendor => vendor.id === id);
  };

  const isWarrantyValid = (asset: Asset) => {
    if (!asset.warrantyExpiry) return false;
    return new Date(asset.warrantyExpiry) > new Date();
  };

  const getWarrantyStatus = (asset: Asset) => {
    if (!asset.warrantyExpiry) return null;
    const expiryDate = new Date(asset.warrantyExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', days: Math.abs(daysUntilExpiry) };
    if (daysUntilExpiry <= 30) return { status: 'expiring', days: daysUntilExpiry };
    return { status: 'valid', days: daysUntilExpiry };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = getAssetById(newRequest.assetId);
    const warrantyEligible = asset ? isWarrantyValid(asset) : false;
    
    const newMaintenanceRequest: MaintenanceRequest = {
      id: `MR-${String(requests.length + 1).padStart(3, '0')}`,
      assetId: newRequest.assetId,
      userId: currentUser.id,
      title: newRequest.title,
      description: newRequest.description,
      priority: newRequest.priority,
      category: newRequest.category,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      attachments: [],
      warrantyEligible
    };
    
    setRequests([newMaintenanceRequest, ...requests]);
    setIsNewRequestModalOpen(false);
    setNewRequest({
      assetId: '',
      title: '',
      description: '',
      priority: 'medium',
      category: 'hardware'
    });
  };

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleAssignRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsAssignModalOpen(true);
  };

  const handleAssignToHelpDesk = (employeeId: string) => {
    if (selectedRequest) {
      const updatedRequest = {
        ...selectedRequest,
        assignedTo: employeeId,
        assignedType: 'helpdesk' as const,
        status: 'in-progress' as const
      };
      setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
      setSelectedRequest(updatedRequest);
      setIsAssignModalOpen(false);
    }
  };

  const handleAssignToVendor = (vendorId: string) => {
    if (selectedRequest) {
      const updatedRequest = {
        ...selectedRequest,
        assignedTo: vendorId,
        assignedType: 'vendor' as const,
        status: 'in-progress' as const
      };
      setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
      setSelectedRequest(updatedRequest);
      setIsAssignModalOpen(false);
    }
  };

  const handleAddAttachment = (file: File) => {
    if (selectedRequest) {
      const newAttachment: MaintenanceAttachment = {
        id: `att-${Date.now()}`,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        uploadDate: new Date().toISOString()
      };

      const updatedRequest = {
        ...selectedRequest,
        attachments: [...(selectedRequest.attachments || []), newAttachment]
      };

      setRequests(requests.map(r => r.id === selectedRequest.id ? updatedRequest : r));
      setSelectedRequest(updatedRequest);
      setIsAttachmentModalOpen(false);
    }
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    setIsViewModalOpen(false);
  };

  const handleUpdateStatus = (requestId: string, newStatus: MaintenanceRequest['status']) => {
    setRequests(requests.map(r => 
      r.id === requestId 
        ? { 
            ...r, 
            status: newStatus,
            actualCompletion: newStatus === 'completed' ? new Date().toISOString() : r.actualCompletion
          }
        : r
    ));
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest({
        ...selectedRequest,
        status: newStatus,
        actualCompletion: newStatus === 'completed' ? new Date().toISOString() : selectedRequest.actualCompletion
      });
    }
  };

  const handleUpdateWarrantyUsed = (requestId: string, warrantyUsed: boolean) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, warrantyUsed } : r
    ));
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest({ ...selectedRequest, warrantyUsed });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Maintenance Requests</h1>
              <p className="text-slate-300 mt-1">Submit and track asset maintenance requests</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
              <p className="text-sm font-medium text-slate-600">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm font-medium text-slate-600">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {requests.filter(r => r.status === 'in-progress').length}
              </p>
              <p className="text-sm font-medium text-slate-600">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {requests.filter(r => r.status === 'completed').length}
              </p>
              <p className="text-sm font-medium text-slate-600">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {requests.filter(r => r.warrantyEligible).length}
              </p>
              <p className="text-sm font-medium text-slate-600">Warranty Eligible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search requests by title, description, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const asset = getAssetById(request.assetId);
          const user = getUserById(request.userId);
          const warrantyStatus = asset ? getWarrantyStatus(asset) : null;
          
          return (
            <div
              key={request.id}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{request.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                      {getPriorityIcon(request.priority)}
                      <span className="ml-1 capitalize">{request.priority}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status.replace('-', ' ')}</span>
                    </span>
                    {request.warrantyEligible && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-800 border-emerald-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Warranty
                      </span>
                    )}
                    {request.warrantyUsed && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Used
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3 line-clamp-2">{request.description}</p>
                  
                  {/* Warranty Alert */}
                  {asset && warrantyStatus && request.warrantyEligible && !request.warrantyUsed && (
                    <div className={`mb-3 p-3 rounded-lg border ${
                      warrantyStatus.status === 'expired' 
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : warrantyStatus.status === 'expiring'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {warrantyStatus.status === 'expired' 
                            ? `Warranty expired ${warrantyStatus.days} days ago`
                            : warrantyStatus.status === 'expiring'
                            ? `Warranty expires in ${warrantyStatus.days} days - Use it now!`
                            : `Warranty valid for ${warrantyStatus.days} more days`
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{asset?.name || 'Unknown Asset'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{user?.name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(request.submittedDate).toLocaleDateString()}</span>
                    </div>
                    {request.assignedTo && (
                      <div className="flex items-center space-x-1">
                        {request.assignedType === 'helpdesk' ? (
                          <>
                            <Users className="w-4 h-4" />
                            <span>Help Desk: {getHelpDeskEmployeeById(request.assignedTo)?.name}</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-4 h-4" />
                            <span>Vendor: {getVendorById(request.assignedTo)?.name}</span>
                          </>
                        )}
                      </div>
                    )}
                    {request.attachments && request.attachments.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="w-4 h-4" />
                        <span>{request.attachments.length} attachment{request.attachments.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewRequest(request)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {currentUser.role === 'Admin' && request.status === 'pending' && (
                    <button
                      onClick={() => handleAssignRequest(request)}
                      className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                      title="Assign Request"
                    >
                      <Users className="w-5 h-5" />
                    </button>
                  )}
                  {currentUser.role === 'Admin' && (
                    <div className="flex space-x-1">
                      <select
                        value={request.status}
                        onChange={(e) => handleUpdateStatus(request.id, e.target.value as MaintenanceRequest['status'])}
                        className="text-xs px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No maintenance requests found</h3>
            <p className="text-slate-600">Try adjusting your search criteria or create a new request.</p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">New Maintenance Request</h2>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Asset</label>
                <select
                  value={newRequest.assetId}
                  onChange={(e) => {
                    setNewRequest({ ...newRequest, assetId: e.target.value });
                  }}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Select Asset</option>
                  {assets.map(asset => {
                    const warrantyStatus = getWarrantyStatus(asset);
                    return (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.id}) {warrantyStatus?.status === 'valid' ? '🛡️' : ''}
                      </option>
                    );
                  })}
                </select>
                {newRequest.assetId && (() => {
                  const selectedAsset = getAssetById(newRequest.assetId);
                  const warrantyStatus = selectedAsset ? getWarrantyStatus(selectedAsset) : null;
                  return selectedAsset && warrantyStatus && (
                    <div className={`mt-2 p-3 rounded-lg border ${
                      warrantyStatus.status === 'valid' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : warrantyStatus.status === 'expiring'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">
                          {warrantyStatus.status === 'valid' 
                            ? `Warranty valid until ${new Date(selectedAsset.warrantyExpiry!).toLocaleDateString()}`
                            : warrantyStatus.status === 'expiring'
                            ? `Warranty expires in ${warrantyStatus.days} days!`
                            : `Warranty expired ${warrantyStatus.days} days ago`
                          }
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Detailed description of the issue, steps to reproduce, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="network">Network</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors duration-200"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {isAssignModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Assign Request: {selectedRequest.title}</h2>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Help Desk Employees */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Help Desk Team
                </h3>
                <div className="space-y-3">
                  {helpDeskEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        employee.available 
                          ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                      onClick={() => employee.available && handleAssignToHelpDesk(employee.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-slate-900">{employee.name}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              employee.available 
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {employee.available ? 'Available' : 'Busy'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{employee.email}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs text-slate-500">Specialization:</span>
                            <div className="flex space-x-1">
                              {employee.specialization.map((spec) => (
                                <span key={spec} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>Current workload: {employee.workload} requests</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendors */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  External Vendors
                </h3>
                <div className="space-y-3">
                  {vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="p-4 border-2 border-slate-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all duration-200"
                      onClick={() => handleAssignToVendor(vendor.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-900">{vendor.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-slate-700">{vendor.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{vendor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs text-slate-500">Specialization:</span>
                          <div className="flex space-x-1">
                            {vendor.specialization.map((spec) => (
                              <span key={spec} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Response: {vendor.responseTime}</span>
                          {vendor.hourlyRate && (
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              ${vendor.hourlyRate}/hr
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Request Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAttachmentModalOpen(true)}
                  className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                  title="Add Attachment"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                {currentUser.role === 'Admin' && (
                  <button
                    onClick={() => handleDeleteRequest(selectedRequest.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete Request"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Request Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Request ID</label>
                      <p className="text-slate-900">{selectedRequest.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Title</label>
                      <p className="text-slate-900">{selectedRequest.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Description</label>
                      <p className="text-slate-900">{selectedRequest.description}</p>
                    </div>
                    <div className="flex space-x-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Priority</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedRequest.priority)} ml-2`}>
                          {getPriorityIcon(selectedRequest.priority)}
                          <span className="ml-1 capitalize">{selectedRequest.priority}</span>
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Status</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)} ml-2`}>
                          {getStatusIcon(selectedRequest.status)}
                          <span className="ml-1 capitalize">{selectedRequest.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Asset Information</h3>
                  {(() => {
                    const asset = getAssetById(selectedRequest.assetId);
                    const warrantyStatus = asset ? getWarrantyStatus(asset) : null;
                    return asset ? (
                      <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                        <p><span className="font-medium">Name:</span> {asset.name}</p>
                        <p><span className="font-medium">ID:</span> {asset.id}</p>
                        <p><span className="font-medium">Category:</span> {asset.category}</p>
                        <p><span className="font-medium">Location:</span> {asset.location}</p>
                        <p><span className="font-medium">Serial Number:</span> {asset.serialNumber}</p>
                        {asset.warranty && (
                          <div className="pt-2 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Warranty:</span>
                              <div className="flex items-center space-x-2">
                                <span>{asset.warranty}</span>
                                {warrantyStatus && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                    warrantyStatus.status === 'valid' 
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                      : warrantyStatus.status === 'expiring'
                                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                                      : 'bg-red-100 text-red-800 border-red-200'
                                  }`}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {warrantyStatus.status === 'valid' ? 'Valid' : 
                                     warrantyStatus.status === 'expiring' ? 'Expiring' : 'Expired'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              Expires: {new Date(asset.warrantyExpiry!).toLocaleDateString()}
                            </p>
                            {selectedRequest.warrantyEligible && currentUser.role === 'Admin' && (
                              <div className="mt-2 flex items-center space-x-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedRequest.warrantyUsed || false}
                                    onChange={(e) => handleUpdateWarrantyUsed(selectedRequest.id, e.target.checked)}
                                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <span className="text-sm text-slate-700">Warranty used for this repair</span>
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-500">Asset information not available</p>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Assignment & Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Submitted</label>
                      <p className="text-slate-900">{new Date(selectedRequest.submittedDate).toLocaleString()}</p>
                    </div>
                    {selectedRequest.assignedTo && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Assigned To</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {selectedRequest.assignedType === 'helpdesk' ? (
                            <>
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-slate-900">{getHelpDeskEmployeeById(selectedRequest.assignedTo)?.name}</span>
                              <span className="text-xs text-slate-500">(Help Desk)</span>
                            </>
                          ) : (
                            <>
                              <Building2 className="w-4 h-4 text-orange-600" />
                              <span className="text-slate-900">{getVendorById(selectedRequest.assignedTo)?.name}</span>
                              <span className="text-xs text-slate-500">(Vendor)</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedRequest.estimatedCompletion && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Estimated Completion</label>
                        <p className="text-slate-900">{new Date(selectedRequest.estimatedCompletion).toLocaleString()}</p>
                      </div>
                    )}
                    {selectedRequest.actualCompletion && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Completed</label>
                        <p className="text-slate-900">{new Date(selectedRequest.actualCompletion).toLocaleString()}</p>
                      </div>
                    )}
                    {selectedRequest.cost !== undefined && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">Cost</label>
                        <p className="text-slate-900 flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {selectedRequest.cost === 0 ? 'Free (Warranty)' : `$${selectedRequest.cost.toLocaleString()}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRequest.resolution && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Resolution</h3>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-green-800">{selectedRequest.resolution}</p>
                    </div>
                  </div>
                )}

                {selectedRequest.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Notes</h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-900">{selectedRequest.notes}</p>
                    </div>
                  </div>
                )}

                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Attachments</h3>
                    <div className="space-y-2">
                      {selectedRequest.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900">{attachment.fileName}</p>
                              <p className="text-xs text-slate-500">
                                {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <a
                            href={attachment.fileUrl}
                            download={attachment.fileName}
                            className="text-orange-600 hover:text-orange-700 text-sm"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Attachment Modal */}
      {isAttachmentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Attachment</h2>
              <button
                onClick={() => setIsAttachmentModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <FileUpload
                onFileSelect={handleAddAttachment}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                maxSize={10}
              />
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Supported Files:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Documents: PDF, DOC, DOCX, TXT</li>
                <li>• Images: JPG, JPEG, PNG</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}