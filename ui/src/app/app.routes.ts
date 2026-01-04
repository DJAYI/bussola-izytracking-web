import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard/dashboard-layout';
import { App } from './app';
import { clientRoutes } from './features/companies/clients/companies-clients.routes';
import { transportProvidersRoutes } from './features/companies/transport-providers/companies-transport-providers.routes';
import { LoginPage } from './auth/pages/login/login';
import { ProfilePage } from './auth/pages/profile/profile';
import { servicesRoutes } from './features/services/services.routes';
import { authGuard, publicGuard, roleGuard } from './auth/guards';
import { UserRole } from './auth/models/role.enum';

export const routes: Routes = [
    {
        path: 'home',
        component: App
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                canActivate: [publicGuard],
                component: LoginPage
            },
            {
                path: 'register',
                canActivate: [publicGuard],
                component: App
            },
            {
                path: '2fa',
                component: App
            }
        ]
    },
    {
        path: 'admin',
        component: DashboardLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'services',
                pathMatch: 'full',
            },
            {
                path: 'services',
                data: { title: 'Servicios' },
                canActivate: [roleGuard([UserRole.AGENCY, UserRole.TRANSPORT_PROVIDER])],
                children: servicesRoutes
            },
            {
                path: 'agencies',
                data: { title: 'Agencias' },
                canActivate: [roleGuard([UserRole.ADMIN])],
                children: clientRoutes
            },
            {
                path: 'transport-providers',
                data: { title: 'Transportistas' },
                canActivate: [roleGuard([UserRole.ADMIN])],
                children: transportProvidersRoutes
            },
            {
                path: 'vehicles',
                component: App,
                data: { title: 'Vehículos' },
                canActivate: [roleGuard([UserRole.TRANSPORT_PROVIDER])]
            },
            {
                path: 'drivers',
                component: App,
                data: { title: 'Conductores' },
                canActivate: [roleGuard([UserRole.TRANSPORT_PROVIDER])]
            },
            {
                path: 'tariff',
                component: App,
                data: { title: 'Tarifas' },
                canActivate: [roleGuard([UserRole.TRANSPORT_PROVIDER])]
            },
            {
                path: 'history',
                component: App,
                data: { title: 'Historial de Servicios' },
                canActivate: [roleGuard([UserRole.AGENCY, UserRole.TRANSPORT_PROVIDER])]
            },
            {
                path: 'invoices',
                component: App,
                data: { title: 'Facturas' },
                canActivate: [roleGuard([UserRole.AGENCY, UserRole.TRANSPORT_PROVIDER])]
            },
            {
                path: 'profile',
                component: ProfilePage,
                data: { title: 'Perfil' }
            },
            {
                path: 'settings',
                component: App,
                data: { title: 'Configuración' }
            }
        ]
    }, {
        path: '**',
        redirectTo: 'admin'
    }
];
