import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, Package, Tags, Building2, BookOpen, Menu, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from './LanguageSwitch';

export function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = React.useMemo(() => [
    { path: '/pos', icon: Store, label: t('navigation.menu.pos') },
    { path: '/inventory', icon: Package, label: t('navigation.menu.inventory') },
    { path: '/orders', icon: FileText, label: t('navigation.menu.orders') },
    { path: '/categories', icon: BookOpen, label: t('navigation.menu.categories') },
    { path: '/brands', icon: Tags, label: t('navigation.menu.brands') },
    { path: '/suppliers', icon: Building2, label: t('navigation.menu.suppliers') }
  ], [t]);

  return (
    <div 
      className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen flex flex-col`}
    >
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Sivaji
              </h1>
              <p className="text-sm text-blue-200 font-medium">
                Groups
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Menu size={isCollapsed ? 28 : 24} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${isCollapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700/50'
                  }
                `}
                title={isCollapsed ? label : undefined}
              >
                <Icon size={isCollapsed ? 28 : 24} 
                      className={`transition-all duration-300 ${
                        isCollapsed ? 'scale-110' : ''
                      }`}
                />
                {!isCollapsed && <span className="text-sm">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-4 border-t border-blue-700 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <LanguageSwitch isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}