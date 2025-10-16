import { useState } from 'react';
import { FileText, Plus, X, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { mockReports, mockTanks } from '../utils/mockData';
import { Report } from '../types';
import { useAuth } from '../context/AuthContext';

export function Reports() {
  const { user, hasRole } = useAuth();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'resolved'>('all');

  const [formData, setFormData] = useState({
    tankId: mockTanks[0].id,
    reportType: 'dirty_water' as const,
    description: '',
    photoUrl: '',
  });

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: Report = {
      id: Date.now().toString(),
      tankId: formData.tankId,
      tankName: mockTanks.find(t => t.id === formData.tankId)?.name || '',
      submittedBy: user?.id || '',
      submittedByName: user?.fullName || '',
      reportType: formData.reportType,
      description: formData.description,
      photoUrl: formData.photoUrl || undefined,
      status: 'pending',
      createdAt: new Date(),
    };

    setReports([newReport, ...reports]);
    setShowForm(false);
    setFormData({
      tankId: mockTanks[0].id,
      reportType: 'dirty_water',
      description: '',
      photoUrl: '',
    });
  };

  const handleReview = (reportId: string, newStatus: 'under_review' | 'resolved' | 'dismissed', notes?: string) => {
    if (!hasRole(['admin'])) {
      alert('Only Admins can review reports');
      return;
    }

    setReports(prev => prev.map(report =>
      report.id === reportId
        ? {
            ...report,
            status: newStatus,
            reviewedBy: user?.fullName,
            reviewedAt: new Date(),
            resolutionNotes: notes || report.resolutionNotes,
          }
        : report
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'under_review': return <Clock size={16} className="text-blue-600" />;
      case 'resolved': return <CheckCircle size={16} className="text-green-600" />;
      case 'dismissed': return <XCircle size={16} className="text-gray-600" />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'dismissed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const reviewCount = reports.filter(r => r.status === 'under_review').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">Submit and track water quality and infrastructure issues</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Submit Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Pending Review</div>
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            </div>
            <Clock size={32} className="text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Under Review</div>
              <div className="text-3xl font-bold text-blue-600">{reviewCount}</div>
            </div>
            <FileText size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Resolved</div>
              <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Report History</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('under_review')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'under_review' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Under Review
              </button>
              <button
                onClick={() => setFilter('resolved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'resolved' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1.5">{report.status.replace('_', ' ')}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {report.createdAt.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-1">
                    {report.tankName} - {report.reportType.replace('_', ' ').toUpperCase()}
                  </h4>

                  <p className="text-gray-700 text-sm mb-2">{report.description}</p>

                  {report.photoUrl && (
                    <img
                      src={report.photoUrl}
                      alt="Report"
                      className="w-48 h-32 object-cover rounded-lg mb-2"
                    />
                  )}

                  <div className="text-xs text-gray-500">
                    Submitted by: {report.submittedByName}
                  </div>

                  {report.reviewedBy && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-xs font-medium text-blue-900 mb-1">
                        Reviewed by {report.reviewedBy} on {report.reviewedAt?.toLocaleString()}
                      </div>
                      {report.resolutionNotes && (
                        <div className="text-sm text-blue-800">{report.resolutionNotes}</div>
                      )}
                    </div>
                  )}
                </div>

                {hasRole(['admin']) && report.status !== 'resolved' && report.status !== 'dismissed' && (
                  <div className="flex flex-col gap-2">
                    {report.status === 'pending' && (
                      <button
                        onClick={() => handleReview(report.id, 'under_review')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Start Review
                      </button>
                    )}
                    {report.status === 'under_review' && (
                      <>
                        <button
                          onClick={() => {
                            const notes = prompt('Enter resolution notes:');
                            if (notes) handleReview(report.id, 'resolved', notes);
                          }}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleReview(report.id, 'dismissed', 'Report dismissed')}
                          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No reports to display</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Submit New Report</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Tank
                </label>
                <select
                  value={formData.tankId}
                  onChange={(e) => setFormData({ ...formData, tankId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {mockTanks.map(tank => (
                    <option key={tank.id} value={tank.id}>
                      {tank.name} - {tank.locationName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="dirty_water">Dirty Water</option>
                  <option value="broken_filter">Broken Filter</option>
                  <option value="infrastructure">Infrastructure Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <Upload size={20} className="text-gray-400" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
