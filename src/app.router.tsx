import { lazy } from "react";
import { createHashRouter, Navigate, RouterProvider } from "react-router";

import { ShopLayout } from "./shop/layouts/ShopLayout";
import { HomePage } from "./shop/pages/home/HomePage";
import { ProductPage } from "./shop/pages/product/ProductPage";
import { GenderPage } from "./shop/pages/gender/GenderPage";

import { LoginPage } from "./auth/pages/login/LoginPage";
import { RegisterPage } from "./auth/pages/register/RegisterPage";

import { DashboardPage } from "./admin/pages/dashboard/DashboardPage";
import { AdminProductsPage } from "./admin/pages/products/AdminProductsPage";
import { AdminProductPage } from "./admin/pages/product/AdminProductPage";

import { AdminRoute, NotAuthenticatedRoute, AuthenticatedRoute } from "./components/routes/ProtectedRoutes";
import { FavoriteUser } from "./shop/pages/profile/FavoriteUser";
import { ProfileUser } from "./shop/pages/profile/ProfileUser";
import { CartUser } from "./shop/pages/profile/CartUser";

const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'))
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'))

const appRouter = createHashRouter([
    //Public routes
    {
        path: '/',
        element: <ShopLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: 'product/:idSlug',
                element: <ProductPage/>
            },
            {
                path: 'gender/:gender',
                element: <GenderPage/>
            }
        ]
    },

    //Auth Routes
    {
        path: '/auth',
        element: <NotAuthenticatedRoute>
                    <AuthLayout/>
                 </NotAuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <Navigate to='/auth/login' />
            },
            {
                path: 'login',
                element: <LoginPage/>
            },
            {
                path: 'register',
                element: <RegisterPage/>
            }
        ]
    },

    //Admin Routes
    {
        path: '/admin',
        element: <AdminRoute>
                    <AdminLayout/>
                 </AdminRoute>,
        children: [
            {
                index: true,
                element: <DashboardPage/>
            },
            {
                path: 'products',
                element: <AdminProductsPage/>
            },
            {
                path: 'products/:id',
                element: <AdminProductPage/>
            }
        ]
    },

    //User profile routes
    {
        path: '/profile',
        element: <AuthenticatedRoute>
                    <ShopLayout/>
                </AuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <Navigate to='/profile/user' />
            },
            {
                path: 'user',
                element: <ProfileUser/>
            },
            {
                path: 'favorites',
                element: <FavoriteUser/>
            },
            {
                path: 'cart',
                element: <CartUser/>
            }
        ]
    },
    
    {
        path: '*',
        element: <Navigate to='/' />
    },
])

export function AppRouter() {
  return <RouterProvider router={appRouter} />
}