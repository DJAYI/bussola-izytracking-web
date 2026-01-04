import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarDashboard } from "./sidebar/sidebar-dashboard";
import { HeaderDashboard } from "./header/header-dashboard";

@Component({
    selector: 'app-dashboard-layout',
    template: `
        <main class="min-h-screen">
            <app-sidebar-dashboard [open]="sidebarOpen()" />
            <main class="flex flex-col transition-all duration-300 ease-in-out" [class.ml-64]="sidebarOpen()">
                <app-header-dashboard  (toggleSidebar)="toggleSidebar()" [sidebarOpen]="sidebarOpen()" />
                <div class="p-7">
                    <router-outlet></router-outlet>
                </div>
            </main>
        </main>
    `,
    imports: [RouterOutlet, SidebarDashboard, HeaderDashboard],
})

export class DashboardLayout {
    sidebarOpen = signal(false);

    toggleSidebar() {
        this.sidebarOpen.update(value => !value);
    }
}