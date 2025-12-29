import { Component, input } from "@angular/core";
import { SidebarNavItem } from "./nav-item/sidebar-nav-item";
import { link } from "fs";

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
    links = [
        { link: 'clients', name: 'Clientes' },
        { link: 'transport-providers', name: 'Proveedores de Transporte' },
        { link: 'services', name: 'Servicios' },
        { link: 'vehicles', name: 'Vehículos' },
        { link: 'drivers', name: 'Conductores' },
        { link: 'tariff', name: 'Tarifario' },
        { link: 'history', name: 'Historial' },
        { link: 'invoices', name: 'Facturas' },
    ]
    open = input.required<boolean>();
}