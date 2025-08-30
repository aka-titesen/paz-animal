'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  roles: string[];
}

interface AdminNavigationProps {
  user: User;
}

export default function AdminNavigation({ user }: AdminNavigationProps) {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const navigationItems = [
    {
      href: '/admin',
      name: 'Panel Principal',
      icon: '📊',
      exact: true
    },
    {
      href: '/admin/usuarios',
      name: 'Usuarios',
      icon: '👥'
    },
    {
      href: '/admin/voluntarios',
      name: 'Voluntarios',
      icon: '🤝'
    },
    {
      href: '/admin/eventos',
      name: 'Eventos',
      icon: '📅'
    },
    {
      href: '/admin/donaciones',
      name: 'Donaciones',
      icon: '💰'
    },
    {
      href: '/admin/publicaciones',
      name: 'Publicaciones',
      icon: '📄'
    },
    {
      href: '/admin/auditoria',
      name: 'Auditoría',
      icon: '📋'
    },
  ];

  const isActive = (item: typeof navigationItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/admin" className="text-2xl font-bold text-green-600 hover:text-green-700">
              🐾 Paz Animal - Admin
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bienvenido, {user.name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="border-t border-gray-200">
          <nav className="flex space-x-8 mt-4 pb-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
