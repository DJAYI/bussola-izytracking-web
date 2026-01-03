import { Component, inject, input, OnInit } from "@angular/core";
import { SidebarNavItem } from "./nav-item/sidebar-nav-item";
import { AuthService } from "../../../auth/auth,service";

type SidebarLink = {
    link: string;
    name: string;
    role: string[];
}

@Component({
    selector: 'sidebar-dashboard',
    template: `<aside [class]="open() ? '' : '-translate-x-full'" class="w-64 top-0 min-h-screen fixed   transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full z-50 rounded-tr-4xl bg-white border-r-2 border-red-300 bg-linear-to-b from-60% from-white to-red-100 ">
            <!-- Logo Section -->
            <div class="px-4 py-6 ">
                <div class="flex items-center justify-center gap-3 border-b-2 border-gray-200 pb-4.25">
                    <span class="text-xl font-bold bg-linear-to-r from-amber-900 to-red-500 bg-clip-text text-transparent text-center ">
                        IZY TRACKING
                        <br>
                        <span class="text-sm font-light text-gray-500">By 
                            <span class="font-semibold text-red-700">Bussola INC.</span></span>
                    </span>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-track-gray-800/50">
                <ul class="space-y-1 px-3">
                    

                    @for (link of links; track $index) {
                        <li>
                            <sidebar-nav-item [link]="link.link" [name]="link.name" />
                        </li>
                    }
                </ul>
            </nav>
            </aside>`,
    imports: [SidebarNavItem],
})
export class SidebarDashboard {
    authService = inject(AuthService);

    links: SidebarLink[] = [
        { link: 'agencies', name: 'Agencias', role: ['ADMIN'] },
        { link: 'transport-providers', name: 'Proveedores de Transporte', role: ['ADMIN'] },
        { link: 'services', name: 'Servicios', role: ['AGENCY', 'TRANSPORT_PROVIDER'] },
        { link: 'vehicles', name: 'Vehículos', role: ['TRANSPORT_PROVIDER'] },
        { link: 'drivers', name: 'Conductores', role: ['TRANSPORT_PROVIDER'] },
        { link: 'tariff', name: 'Tarifario', role: ['TRANSPORT_PROVIDER'] },
        { link: 'history', name: 'Historial', role: ['AGENCY', 'TRANSPORT_PROVIDER'] },
        { link: 'invoices', name: 'Facturas', role: ['AGENCY', 'TRANSPORT_PROVIDER'] },
    ]
    open = input.required<boolean>();

    constructor() {
        this.authService.getCurrentSession().subscribe({
            next: (res) => {
                this.links = this.links.filter(link => link.role.includes(res.data.role));
            },
            error: (error) => {
                console.error('Failed to filter sidebar links based on user role', error);
            }
        });
    }
}