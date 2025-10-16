import { LayoutDashboard, AlertTriangle, FileText, Wrench, Settings, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-slate-800 text-white w-64 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-2">
                <img
                  src="/Users/owensengdalavong/namjai_project/src/resources/namjai.png"
                  // alt="Namjai Logo"
                  // className="w-8 h-8 rounded-lg object-cover"
                />
              <span className="font-semibold text-lg">Namjai</span>
            </div>
            <button onClick={onClose} className="md:hidden">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 border-b border-slate-700">
            <div className="text-sm opacity-75">Logged in as</div>
            <div className="font-medium truncate">{user?.fullName}</div>
            <div className="text-xs opacity-60 capitalize">{user?.role.replace('_', ' ')}</div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
      <button
        onClick={onMenuClick}
        className="md:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={24} />
      </button>
      <h1 className="text-2xl font-bold text-slate-800">Water Quality Monitoring System</h1>
    </header>
  );
}
