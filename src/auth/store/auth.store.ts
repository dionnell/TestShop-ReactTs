import type { User } from '@/interface/user.interface'
import { create } from 'zustand'
import { loginAction } from '../action/login.action'
import { checkAuthAction } from '../action/check-auth.action'
import { registerAction } from '../action/register.action'


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking'

type AuthState = {
  //propiedades
  user: User | null;
  token: string | null;
  authStatus: AuthStatus

  //getters
  isAdmin: () => boolean

  //actions
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, fullName: string) => Promise<boolean>
  logout: () => void
  checkAuthStatus: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    //implementacion del store por defecto
    user: null,
    token: null,
    authStatus: 'not-authenticated',

    //getters
    isAdmin: () => {
        const roles = get().user?.roles || []
        return roles.includes('admin')
    },
  
    //Acciones
    login: async(email: string, password: string) => {
        try {
            const data = await loginAction(email, password)
            localStorage.setItem('token', data.token)

            set({
                user: data.user,
                token: data.token,
                authStatus: 'authenticated'
            })
            return true
        } catch (error) {
            localStorage.removeItem('token')
            set({
                user: null,
                token: null,
                authStatus: 'not-authenticated'
            })
            return false
        }
    },
    register: async(fullName: string, email: string, password: string) => {
        try {
            const data = await registerAction(fullName, email, password)
            localStorage.setItem('token', data.token)

            set({
                user: data.user,
                token: data.token,
                authStatus: 'authenticated'
            })
            return true
            
        } catch (error) {
            localStorage.removeItem('token')
            set({
                user: null,
                token: null,
                authStatus: 'not-authenticated'
            })
            return false
        }
        
    },
    logout: () => {
        localStorage.removeItem('token')
        set({
                user: null,
                token: null,
                authStatus: 'not-authenticated'
            })
    },
    checkAuthStatus: async() => {
        try {
            const { user, token } = await checkAuthAction()
            set({
                user: user,
                token: token,
                authStatus: 'authenticated'
            })

            return true
        } catch (error) {
            set({
                user: undefined,
                token: undefined,
                authStatus: 'not-authenticated'
            })
            return false
        }
    }
}))
