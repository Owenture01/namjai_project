import { useState } from 'react';
import { Wrench, Battery, Wifi, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import { mockSensorStatus, mockMaintenanceLogs, mockTanks } from '../utils/mockData';
import { SensorStatus, MaintenanceLog } from '../types';
import { useAuth } from '../context/AuthContext';

export function Maintenance() {
  const { user, hasRole } = useAuth();
  const [sensorStatuses] = useState<SensorStatus[]>(mockSensorStatus);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(mockMaintenanceLogs);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'in_progress' | 'completed'>('all');

  const [formData, setFormData] = useState({
    tankId: mockTanks[0].id,
    maintenanceType: 'sensor_calibration' as const,
    description: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    cost: 0,
  });

  const filteredLogs = maintenanceLogs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasRole(['admin', 'field_officer'])) {
      alert('Only Admins and Field Officers can schedule maintenance');
      return;
    }

    const newLog: MaintenanceLog = {
      id: Date.now().toString(),
      tankId: formData.tankId,
      tankName: mockTanks.find(t => t.id === formData.tankId)?.name || '',
      maintenanceType: formData.maintenanceType,
      description: formData.description,
      performedBy: user?.id || '',
      performedByName: user?.fullName || '',
      scheduledDate: new Date(formData.scheduledDate),
      status: 'scheduled',
      cost: formData.cost,
    };

    setMaintenanceLogs([newLog, ...maintenanceLogs]);
    setShowForm(false);
    setFormData({
      tankId: mockTanks[0].id,
      maintenanceType: 'sensor_calibration',
      description: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      cost: 0,
    });
  };

  const updateLogStatus = (logId: string, newStatus: 'in_progress' | 'completed' | 'cancelled') => {
    if (!hasRole(['admin', 'field_officer'])) {
      alert('Only Admins and Field Officers can update maintenance status');
      return;
    }

    setMaintenanceLogs(prev => prev.map(log =>
      log.id === logId
        ? {
            ...log,
            status: newStatus,
            completedDate: newStatus === 'completed' ? new Date() : log.completedDate,
          }
        : log
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'needs_calibration': return 'text-yellow-600 bg-yellow-100';
      case 'faulty': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const operationalCount = sensorStatuses.filter(s => s.status === 'operational').length;
  const needsAttentionCount = sensorStatuses.filter(s => s.status !== 'operational').length;
  const scheduledCount = maintenanceLogs.filter(l => l.status === 'scheduled').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance</h2>
          <p className="text-gray-600">Sensor status and maintenance scheduling</p>
        </div>
        {hasRole(['admin', 'field_officer']) && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Schedule Maintenance
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Operational Sensors</div>
              <div className="text-3xl font-bold text-green-600">{operationalCount}</div>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Needs Attention</div>
              <div className="text-3xl font-bold text-orange-600">{needsAttentionCount}</div>
            </div>
            <AlertCircle size={32} className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Scheduled Tasks</div>
              <div className="text-3xl font-bold text-blue-600">{scheduledCount}</div>
            </div>
            <Wrench size={32} className="text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sensor Status</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sensor Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Battery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Calibration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Calibration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensorStatuses.map((sensor) => (
                <tr key={sensor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sensor.tankName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {sensor.sensorType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(sensor.status)}`}>
                      {sensor.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Battery size={16} className={`mr-2 ${sensor.batteryLevel < 30 ? 'text-red-600' : sensor.batteryLevel < 60 ? 'text-yellow-600' : 'text-green-600'}`} />
                      <span>{sensor.batteryLevel}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Wifi size={16} className={`mr-2 ${sensor.signalStrength < 40 ? 'text-red-600' : sensor.signalStrength < 70 ? 'text-yellow-600' : 'text-green-600'}`} />
                      <span>{sensor.signalStrength}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sensor.lastCalibration?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={sensor.nextCalibration && sensor.nextCalibration < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {sensor.nextCalibration?.toLocaleDateString() || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Logs</h3>
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
                onClick={() => setFilter('scheduled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getMaintenanceStatusColor(log.status)}`}>
                      {log.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{log.tankName}</span>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-1 capitalize">
                    {log.maintenanceType.replace(/_/g, ' ')}
                  </h4>

                  <p className="text-gray-700 text-sm mb-2">{log.description}</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                    <div>Performed by: {log.performedByName}</div>
                    <div>Scheduled: {log.scheduledDate.toLocaleDateString()}</div>
                    {log.completedDate && (
                      <div>Completed: {log.completedDate.toLocaleDateString()}</div>
                    )}
                    {log.cost > 0 && <div>Cost: ${log.cost.toFixed(2)}</div>}
                  </div>

                  {log.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                      <span className="font-medium">Notes:</span> {log.notes}
                    </div>
                  )}
                </div>

                {hasRole(['admin', 'field_officer']) && log.status !== 'completed' && log.status !== 'cancelled' && (
                  <div className="flex flex-col gap-2">
                    {log.status === 'scheduled' && (
                      <button
                        onClick={() => updateLogStatus(log.id, 'in_progress')}
                        className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
                      >
                        Start Work
                      </button>
                    )}
                    {log.status === 'in_progress' && (
                      <button
                        onClick={() => updateLogStatus(log.id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      onClick={() => updateLogStatus(log.id, 'cancelled')}
                      className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Wrench size={48} className="mx-auto mb-4 opacity-50" />
            <p>No maintenance logs to display</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Schedule Maintenance</h3>
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
                  Maintenance Type
                </label>
                <select
                  value={formData.maintenanceType}
                  onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="sensor_calibration">Sensor Calibration</option>
                  <option value="sensor_replacement">Sensor Replacement</option>
                  <option value="tank_cleaning">Tank Cleaning</option>
                  <option value="filter_replacement">Filter Replacement</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the maintenance work..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  Schedule Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
