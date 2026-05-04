import React, { useRef, useState } from 'react';
import { Search, Bell, MessageSquare, Settings, Menu, X, Home, BarChart3, Heart, Users, ShoppingCart, FileText } from 'lucide-react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLocation, useNavigate, Link } from 'react-router';
import { CustomLogo } from '@/components/custom/CustomLogo';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home,         label: 'Dashboard',  to: '/admin' },
  { icon: BarChart3,    label: 'Productos',   to: '/admin/products' },
  { icon: Heart,        label: 'Favoritos',   to: '/admin/favorites' },
  { icon: Users,        label: 'Usuarios',    to: '/admin/users' },
  { icon: ShoppingCart, label: 'Ordenes',     to: '/admin/orders' },
  { icon: FileText,     label: 'Reportes',    to: '/admin' },
]

export const AdminHeader: React.FC = () => {
  const { user } = useAuthStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const placeholder = pathname.includes('/admin/users')     ? 'Buscar usuarios...'
                    : pathname.includes('/admin/favorites') ? 'Buscar productos favoritos...'
                    : pathname.includes('/admin/orders')    ? 'Buscar órdenes por email o full name...'
                    : 'Buscar productos...'

  const handleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const isFavorites = pathname.includes('/admin/favorites')
      const isUsers     = pathname.includes('/admin/users')
      const isOrders    = pathname.includes('/admin/orders')
      const basePath    = isFavorites ? '/admin/favorites'
                        : isUsers     ? '/admin/users'
                        : isOrders    ? '/admin/orders'
                        : '/admin/products'

      if (!value.trim()) {
        navigate(basePath)
      } else {
        navigate(`${basePath}?query=${value.trim()}`)
      }
    }, 600)
  }

  const isActiveRoute = (to: string) => {
    if (pathname.includes('/admin/products') && to === '/admin/products') return true
    return pathname === to
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 h-18">
        <div className="flex items-center gap-3">

          {/* Logo + burger — solo en md y menores */}
          <div className="flex items-center gap-1 md:hidden shrink-0">
            <CustomLogo subtitle='S' />
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                onChange={(e) => handleSearch(e.target.value)}
                type="text"
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </button>
            <button className="hidden sm:flex p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare size={20} />
            </button>
            <button className="hidden sm:flex p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
              {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
            </div>
          </div>

        </div>
      </header>

      {/* Menú desplegable — overlay + panel */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

          {/* Panel */}
          <div className="fixed top-[73px] left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg md:hidden">
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                          isActiveRoute(item.to)
                            ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <Icon size={18} className="shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* User info al pie del menú */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3 px-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}