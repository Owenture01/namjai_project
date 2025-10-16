import { useState } from 'react';
import { Settings as SettingsIcon, Users, Bell, Sliders, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { defaultThresholds, mockUsers } from '../utils/mockData';
import { ParameterThreshold, NotificationSettings, User } from '../types';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'thresholds' | 'users' | 'notifications'>('thresholds');
  const [thresholds, setThresholds] = useState<ParameterThreshold[]>(defaultThresholds);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    pushAlerts: true,
    alertSeverityFilter: 'all',
    dailySummary: false,
  });

  const [showAddUser, setShowAddUser] = useState(false);
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    role: 'observer' as const,
  });

  const handleThresholdUpdate = (parameter: string, field: string, value: number) => {
    setThresholds(prev => prev.map(t =>
      t.parameter === parameter ? { ...t, [field]: value } : t
    ));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasRole(['admin'])) {
      alert('Only Admins can add users');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      status: 'active',
      createdAt: new Date(),
    };

    setUsers([...users, user]);
    setShowAddUser(false);
    setNewUser({ email: '', fullName: '', role: 'observer' });
  };

  const handleDeleteUser = (userId: string) => {
    if (!hasRole(['admin'])) {
      alert('Only Admins can delete users');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    if (!hasRole(['admin'])) {
      alert('Only Admins can modify user status');
      return;
    }

    setUsers(prev => prev.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' as const }
        : u
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage system configuration and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('thresholds')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'thresholds'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Sliders size={18} className="mr-2" />
                Parameter Thresholds
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users size={18} className="mr-2" />
                User Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Bell size={18} className="mr-2" />
                Notifications
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'thresholds' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Configure warning and critical thresholds for water quality parameters
                </p>
                {!hasRole(['admin']) && (
                  <span className="text-sm text-gray-500 italic">View only - Admin access required</span>
                )}
              </div>

              <div className="space-y-4">
                {thresholds.map((threshold) => (
                  <div key={threshold.parameter} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                        {threshold.parameter}
                        {threshold.parameter === 'ph' && ' Level'}
                        {threshold.parameter === 'turbidity' && ' (NTU)'}
                        {threshold.parameter === 'tds' && ' (ppm)'}
                        {threshold.parameter === 'temperature' && ' (°C)'}
                      </h3>
                      {hasRole(['admin']) && (
                        <button
                          onClick={() => setEditingThreshold(
                            editingThreshold === threshold.parameter ? null : threshold.parameter
                          )}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-yellow-700">Warning Range</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                            <input
                              type="number"
                              value={threshold.minWarning}
                              onChange={(e) => handleThresholdUpdate(threshold.parameter, 'minWarning', parseFloat(e.target.value))}
                              disabled={!hasRole(['admin']) || editingThreshold !== threshold.parameter}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                            <input
                              type="number"
                              value={threshold.maxWarning}
                              onChange={(e) => handleThresholdUpdate(threshold.parameter, 'maxWarning', parseFloat(e.target.value))}
                              disabled={!hasRole(['admin']) || editingThreshold !== threshold.parameter}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                              step="0.1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-red-700">Critical Range</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                            <input
                              type="number"
                              value={threshold.minCritical}
                              onChange={(e) => handleThresholdUpdate(threshold.parameter, 'minCritical', parseFloat(e.target.value))}
                              disabled={!hasRole(['admin']) || editingThreshold !== threshold.parameter}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                            <input
                              type="number"
                              value={threshold.maxCritical}
                              onChange={(e) => handleThresholdUpdate(threshold.parameter, 'maxCritical', parseFloat(e.target.value))}
                              disabled={!hasRole(['admin']) || editingThreshold !== threshold.parameter}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                              step="0.1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {editingThreshold === threshold.parameter && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => setEditingThreshold(null)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Manage user accounts and roles</p>
                {hasRole(['admin']) && (
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={18} className="mr-2" />
                    Add User
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      {hasRole(['admin']) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{u.fullName}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            u.status === 'active' ? 'bg-green-100 text-green-800' :
                            u.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {u.createdAt.toLocaleDateString()}
                        </td>
                        {hasRole(['admin']) && (
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                {u.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <p className="text-gray-600">Configure your notification preferences</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Alerts</h4>
                    <p className="text-sm text-gray-600">Receive alert notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailAlerts}
                      onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Receive real-time push notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.pushAlerts}
                      onChange={(e) => setNotifications({ ...notifications, pushAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Daily Summary</h4>
                    <p className="text-sm text-gray-600">Receive a daily summary email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.dailySummary}
                      onChange={(e) => setNotifications({ ...notifications, dailySummary: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Alert Severity Filter</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="all"
                        checked={notifications.alertSeverityFilter === 'all'}
                        onChange={(e) => setNotifications({ ...notifications, alertSeverityFilter: e.target.value as any })}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">All alerts (warnings and critical)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="critical_only"
                        checked={notifications.alertSeverityFilter === 'critical_only'}
                        onChange={(e) => setNotifications({ ...notifications, alertSeverityFilter: e.target.value as any })}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Critical alerts only</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="observer">Observer</option>
                  <option value="field_officer">Field Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
