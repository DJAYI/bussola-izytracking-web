import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard/dashboard-layout';
import { App } from './app';
import { clientRoutes } from './features/companies/clients/companies-clients.routes';
import { transportProvidersRoutes } from './features/companies/transport-providers/companies-transport-providers.routes';
import { LoginPage } from './auth/pages/login/login';
import { ProfilePage } from './auth/pages/profile/profile';
import { servicesRoutes } from './features/services/services.routes';

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
                component: LoginPage
            },
            {
                path: 'register',
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
        children: [
            {
                path: '',
                redirectTo: 'services',
                pathMatch: 'full',
            },
            {
                path: 'services',
                data: { title: 'Servicios' },
                children: servicesRoutes
            },
            {
                path: 'agencies',
                data: { title: 'Agencias' },
                children: clientRoutes
            },
            {
                path: 'transport-providers',
                data: { title: 'Transportistas' },
                children: transportProvidersRoutes
            },
            {
                path: 'vehicles',
                component: App,
                data: { title: 'Vehículos' }
            },
            {
                path: 'drivers',
                component: App,
                data: { title: 'Conductores' }
            },
            {
                path: 'tariff',
                component: App,
                data: { title: 'Tarifas' }
            },
            {
                path: 'history',
                component: App,
                data: { title: 'Historial de Servicios' }
            },
            {
                path: 'invoices',
                component: App,
                data: { title: 'Facturas' }
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
