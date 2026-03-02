import { useAuthStore } from "@/auth/store/auth.store"
import type { PropsWithChildren } from "react"
import { CustomFullScreenLoading } from "../custom/CustomFullScreenLoading"
import { Navigate } from "react-router"


export const AuthenticatedRoute = ({children}: PropsWithChildren) => {

    const { authStatus } = useAuthStore()

    if(authStatus === 'checking') return <CustomFullScreenLoading/>
    if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>
  
    return children
}


export const NotAuthenticatedRoute = ({children}: PropsWithChildren) => {

    const { authStatus } = useAuthStore()

    if(authStatus === 'checking') return <CustomFullScreenLoading/>
    if(authStatus === 'authenticated') return <Navigate to='/'/>
  
    return children
}

export const AdminRoute = ({children}: PropsWithChildren) => {

    const { authStatus, isAdmin } = useAuthStore()

    if(authStatus === 'checking') return <CustomFullScreenLoading/>
    if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>
    if(!isAdmin()) return <Navigate to='/'/>
  
    return children
}
