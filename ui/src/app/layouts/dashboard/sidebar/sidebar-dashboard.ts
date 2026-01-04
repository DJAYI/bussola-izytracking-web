import { Component, inject, input } from "@angular/core";
import { SidebarNavItem } from "./nav-item/sidebar-nav-item";
import { AuthService } from "../../../auth/auth,service";
import { UserRole } from "../../../auth/models/role.enum";
import { IconName } from "../../../shared/components/icon";

interface SidebarLink {
    link: string;
    name: string;
    icon: IconName;
    roles: UserRole[];
}

@Component({
    selector: 'app-sidebar-dashboard',
    template: `<aside [class]="open() ? '' : '-translate-x-full'" class="w-64 top-0 min-h-screen fixed   transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full z-50 rounded-r-md bg-red-50 outline outline-red-300  ">
            <!-- Logo Section -->
            <div class="px-4 py-6 ">
                <div class="flex items-center justify-center gap-3 border-b-2 border-red-300 pb-4.25">
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
                <ul class="space-y-2 px-3">
                    

                    @for (link of links; track $index) {
                        <li>
                            <app-sidebar-nav-item [link]="link.link" [name]="link.name" [icon]="link.icon" />
                        </li>
                    }
                </ul>
            </nav>
            </aside>`,
    imports: [SidebarNavItem],
})
export class SidebarDashboard {
    private readonly authService = inject(AuthService);

    links: SidebarLink[] = [
        { link: 'agencies', name: 'Agencias', icon: IconName.BUILDING, roles: [UserRole.ADMIN] },
        { link: 'transport-providers', name: 'Proveedores de Transporte', icon: IconName.TRUCK, roles: [UserRole.ADMIN] },
        { link: 'services', name: 'Servicios', icon: IconName.CLIPBOARD, roles: [UserRole.AGENCY, UserRole.TRANSPORT_PROVIDER] },
        { link: 'vehicles', name: 'Vehículos', icon: IconName.CAR, roles: [UserRole.TRANSPORT_PROVIDER] },
        { link: 'drivers', name: 'Conductores', icon: IconName.USERS, roles: [UserRole.TRANSPORT_PROVIDER] },
        { link: 'tariff', name: 'Tarifario', icon: IconName.CALCULATOR, roles: [UserRole.TRANSPORT_PROVIDER] },
        { link: 'history', name: 'Historial', icon: IconName.CLOCK, roles: [UserRole.AGENCY, UserRole.TRANSPORT_PROVIDER] },
        { link: 'invoices', name: 'Facturas', icon: IconName.DOCUMENT, roles: [UserRole.AGENCY, UserRole.TRANSPORT_PROVIDER] },
    ];
    open = input.required<boolean>();

    constructor() {
        this.authService.getCurrentSession().subscribe({
            next: (res) => {
                // TODO: Filter links based on user role
                this.links = this.links.filter(link => link.roles.includes(res.data.role) ?? false);
            },
            error: (error) => {
                console.error('Failed to filter sidebar links based on user role', error);
            }
        });
    }
}