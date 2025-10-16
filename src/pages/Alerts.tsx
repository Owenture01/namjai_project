import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { mockAlerts } from '../utils/mockData';
import { Alert } from '../types';
import { useAuth } from '../context/AuthContext';

export function Alerts() {
  const { hasRole } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return !alert.acknowledged;
    if (filter === 'acknowledged') return alert.acknowledged;
    return true;
  });

  const handleAcknowledge = (alertId: string) => {
    if (!hasRole(['admin', 'field_officer'])) {
      alert('Only Admins and Field Officers can acknowledge alerts');
      return;
    }

    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, acknowledged: true, acknowledgedBy: 'Current User', acknowledgedAt: new Date() }
        : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'critical'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-orange-100 text-orange-800 border-orange-200';
  };

  const getSeverityIcon = (severity: string) => {
    return severity === 'critical' ? '🔴' : '⚠️';
  };

  const activeAlertsCount = alerts.filter(a => !a.acknowledged).length;
  const criticalAlertsCount = alerts.filter(a => !a.acknowledged && a.severity === 'critical').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Alerts</h2>
        <p className="text-gray-600">Automated water quality alerts and anomalies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Active Alerts</div>
              <div className="text-3xl font-bold text-orange-600">{activeAlertsCount}</div>
            </div>
            <AlertTriangle size={32} className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Critical</div>
              <div className="text-3xl font-bold text-red-600">{criticalAlertsCount}</div>
            </div>
            <AlertTriangle size={32} className="text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Acknowledged</div>
              <div className="text-3xl font-bold text-green-600">{alerts.length - activeAlertsCount}</div>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Alert History</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({activeAlertsCount})
              </button>
              <button
                onClick={() => setFilter('acknowledged')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'acknowledged'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Acknowledged ({alerts.length - activeAlertsCount})
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tank / Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameters
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className={!alert.acknowledged ? 'bg-orange-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2 text-gray-400" />
                      {alert.createdAt.toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{alert.tankName}</div>
                    <div className="text-gray-500 text-xs flex items-center mt-1">
                      <MapPin size={12} className="mr-1" />
                      {alert.locationName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getSeverityColor(alert.severity)}`}>
                      <span className="mr-1">{getSeverityIcon(alert.severity)}</span>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {alert.message}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="space-y-1">
                      {alert.parametersTriggered.map((param, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium">{param.parameter}:</span>{' '}
                          <span className="text-red-600">{param.value}</span>{' '}
                          <span className="text-gray-500">({param.threshold})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alert.acknowledged ? (
                      <div className="text-sm">
                        <div className="flex items-center text-green-600 font-medium">
                          <CheckCircle size={14} className="mr-1" />
                          Acknowledged
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          by {alert.acknowledgedBy}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!alert.acknowledged && hasRole(['admin', 'field_officer']) && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Acknowledge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No alerts to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
