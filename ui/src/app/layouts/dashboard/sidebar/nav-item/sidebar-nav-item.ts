import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'sidebar-nav-item',
    template: `
        <a
            [routerLink]="link()"
            routerLinkActive="bg-red-700 text-white border-red-400"
            class="flex items-center px-3 py-2 text-white rounded-lg ring-0 ring-gray-200 hover:ring-2 border-gray-400 hover:bg-red-200 hover:text-red-800 transition-all ">
            <span class="ml-2 font-medium">{{ name() }}</span>
        </a>
    `,
    imports: [RouterLink, RouterLinkActive]
})
export class SidebarNavItem {
    link = input.required<string>();
    name = input.required<string>();
}