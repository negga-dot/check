import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Plus, Filter, Download, Grid, List } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressBar from '../components/UI/ProgressBar';
import type { Approval } from '../contexts/AppContext';

const ApprovalTracker: React.FC = () => {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApproval, setNewApproval] = useState({
    name: '',
    department: '',
    timeline: '',
  });

  const statusConfig = {
    'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-700', icon: Clock },
    'documents-ready': { label: 'Documents Ready', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
    'submitted': { label: 'Submitted', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    'under-review': { label: 'Under Review', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
    'approved': { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  };

  const filteredApprovals = state.approvals.filter(approval => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !['approved'].includes(approval.status);
    if (filterStatus === 'completed') return approval.status === 'approved';
    return approval.status === filterStatus;
  });

  const completedCount = state.approvals.filter(a => a.status === 'approved').length;
  const totalCount = state.approvals.length;

  const handleStatusChange = (approvalId: string, newStatus: Approval['status']) => {
    dispatch({
      type: 'UPDATE_APPROVAL',
      payload: {
        id: approvalId,
        updates: { status: newStatus }
      }
    });
  };

  const handleAddApproval = () => {
    if (!newApproval.name || !newApproval.department) return;

    const approval: Approval = {
      id: Date.now().toString(),
      name: newApproval.name,
      department: newApproval.department,
      status: 'not-started',
      timeline: newApproval.timeline || '7-15 days',
      priority: 'medium',
      requiredDocs: ['Basic Documents Required'],
      estimatedDays: 14,
    };

    dispatch({ type: 'SET_APPROVALS', payload: [...state.approvals, approval] });
    setNewApproval({ name: '', department: '', timeline: '' });
    setShowAddModal(false);
  };

  const renderCardView = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredApprovals.map((approval) => {
        const StatusIcon = statusConfig[approval.status].icon;
        return (
          <Card key={approval.id} hover>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {approval.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{approval.department}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{approval.timeline}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[approval.status].color}`}>
                <StatusIcon className="h-3 w-3 inline mr-1" />
                {statusConfig[approval.status].label}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={approval.status}
                  onChange={(e) => handleStatusChange(approval.id, e.target.value as Approval['status'])}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="not-started">Not Started</option>
                  <option value="documents-ready">Documents Ready</option>
                  <option value="submitted">Submitted</option>
                  <option value="under-review">Under Review</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  View Details
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Documents
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApprovals.map((approval) => {
              const StatusIcon = statusConfig[approval.status].icon;
              return (
                <tr key={approval.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{approval.name}</div>
                      <div className="text-sm text-gray-500">Priority: {approval.priority}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {approval.department}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={approval.status}
                      onChange={(e) => handleStatusChange(approval.id, e.target.value as Approval['status'])}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${statusConfig[approval.status].color}`}
                    >
                      <option value="not-started">Not Started</option>
                      <option value="documents-ready">Documents Ready</option>
                      <option value="submitted">Submitted</option>
                      <option value="under-review">Under Review</option>
                      <option value="approved">Approved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {approval.timeline}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Docs
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  if (state.approvals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <Card className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Approvals Found</h2>
            <p className="text-gray-600 mb-8">
              Start by completing the setup wizard to generate your personalized approval list.
            </p>
            <Button onClick={() => window.location.href = '/wizard'}>
              Start Setup Wizard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Approval Tracker</h1>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{totalCount - completedCount}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{totalCount}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </Card>
          </div>
          <ProgressBar current={completedCount} total={totalCount} />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Approvals</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="under-review">Under Review</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'card' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" icon={Download} size="sm">
              Export
            </Button>
            <Button icon={Plus} size="sm" onClick={() => setShowAddModal(true)}>
              Add Custom
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'card' ? renderCardView() : renderTableView()}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Approval</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Name *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newApproval.name}
                    onChange={(e) => setNewApproval({ ...newApproval, name: e.target.value })}
                    placeholder="e.g., Import Export Code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newApproval.department}
                    onChange={(e) => setNewApproval({ ...newApproval, department: e.target.value })}
                    placeholder="e.g., DGFT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Timeline
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newApproval.timeline}
                    onChange={(e) => setNewApproval({ ...newApproval, timeline: e.target.value })}
                    placeholder="e.g., 7-15 days"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddApproval} className="flex-1">
                  Add Approval
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalTracker;