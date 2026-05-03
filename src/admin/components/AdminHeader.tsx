import React, { useRef } from 'react';
import { Search, Bell, MessageSquare, Settings } from 'lucide-react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useLocation, useNavigate } from 'react-router';

export const AdminHeader: React.FC = () => {
 
    const { user } = useAuthStore()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const placeholder = pathname.includes('/admin/users') ? 'Buscar usuarios...' 
                        : pathname.includes('/admin/favorites') ? 'Buscar productos favoritos...' 
                        : pathname.includes('/admin/orders') ? 'Buscar órdenes por email o full name...' 
                        : 'Buscar productos...'
    
    const handleSearch = (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      
      debounceRef.current = setTimeout(() => {
        const isFavorites = pathname.includes('/admin/favorites')
        const isUsers = pathname.includes('/admin/users')
        const isOrders = pathname.includes('/admin/orders')
        const basePath = isFavorites ? '/admin/favorites' 
                        : isUsers ? '/admin/users' 
                        : isOrders ? '/admin/orders' 
                        : '/admin/products'
 
        if(!value.trim()){ 
          navigate(basePath)
        } else {
          navigate(`${basePath}?query=${value.trim()}`)
        }
      }, 600)
    }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 h-18">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              onChange={(e) => handleSearch(e.target.value)}
              type="text"
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageSquare size={20} />
          </button>
          
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg transition-shadow">
            {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

