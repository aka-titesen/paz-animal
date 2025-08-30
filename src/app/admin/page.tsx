import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  // Verificar que el usuario tenga rol de admin
  const userRoles = session.user.roles || [];
  if (!userRoles.includes('ADMIN')) {
    redirect('/unauthorized');
  }

  // Obtener estadísticas básicas
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.auditLog.count(),
    prisma.voluntario.count(),
    prisma.donacion.count(),
    prisma.evento.count(),
  ]);

  const [totalUsers, totalAuditLogs, totalVolunteers, totalDonations, totalEvents] = stats;

  const statCards = [
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
      href: '/admin/usuarios'
    },
    {
      title: 'Voluntarios',
      value: totalVolunteers,
      icon: '🤝',
      color: 'bg-green-500',
      href: '/admin/voluntarios'
    },
    {
      title: 'Donaciones',
      value: totalDonations,
      icon: '💰',
      color: 'bg-yellow-500',
      href: '/admin/donaciones'
    },
    {
      title: 'Eventos',
      value: totalEvents,
      icon: '📅',
      color: 'bg-purple-500',
      href: '/admin/eventos'
    },
    {
      title: 'Logs de Auditoría',
      value: totalAuditLogs,
      icon: '📋',
      color: 'bg-orange-500',
      href: '/admin/auditoria'
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">
          Resumen general de la plataforma Paz Animal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-md p-3 text-white text-2xl mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            {stat.href && (
              <div className="mt-4">
                <a
                  href={stat.href}
                  className="text-sm text-green-600 hover:text-green-500 font-medium"
                >
                  Ver detalles →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">
            Bienvenido al panel de administración de Paz Animal. 
            Utiliza el menú superior para navegar entre las diferentes secciones.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Acciones Rápidas</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/admin/voluntarios" className="text-green-600 hover:text-green-500">
                    → Gestionar voluntarios
                  </a>
                </li>
                <li>
                  <a href="/admin/eventos" className="text-green-600 hover:text-green-500">
                    → Crear nuevo evento
                  </a>
                </li>
                <li>
                  <a href="/admin/donaciones" className="text-green-600 hover:text-green-500">
                    → Ver donaciones recientes
                  </a>
                </li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Sistema</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Base de datos conectada</li>
                <li>✅ {totalUsers} usuarios registrados</li>
                <li>✅ {totalVolunteers} voluntarios activos</li>
                <li>✅ Sistema funcionando correctamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
