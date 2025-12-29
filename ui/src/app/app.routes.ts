import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard/dashboard-layout';
import { App } from './app';

export const routes: Routes = [
    {
        path: 'admin',
        component: DashboardLayout,
        children: [
            {
                path: '',
                redirectTo: 'services',
                pathMatch: 'full'
            },
            {
                path: 'services',
                component: App
            },
            {
                path: 'clients',
                component: App
            },
            {
                path: 'transport-providers',
                component: App
            },
            {
                path: 'vehicles',
                component: App
            },
            {
                path: 'drivers',
                component: App
            },
            {
                path: 'tariff',
                component: App
            },
            {
                path: 'history',
                component: App
            },
            {
                path: 'invoices',
                component: App
            }
        ]
    }
];
