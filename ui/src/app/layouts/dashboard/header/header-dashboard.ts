import { Component, input, output } from "@angular/core";
import { ChangeDetectionStrategy } from "@angular/core";
import { HeaderUserPopover } from "./header-user-popover/header-user-popover";
import { activeRouteTitle } from "../../../utils/active-route-title";

@Component({
    selector: "header-dashboard",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <header
            class="bg-white px-1 pt-6 pb-7.75 mx-6 border-b-2 border-red-200 flex items-center justify-between"
        >
            <div class="flex items-center gap-4">
                <button
                    type="button"
                    (click)="toggleSidebar.emit()"
                    class="text-gray-600 hover:text-gray-900 hover:cursor-pointer border-2 border-red-300 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 ring-red-100"
                    [class.bg-red-700]="sidebarOpen()"
                    [attr.aria-pressed]="sidebarOpen()"
                    aria-label="Alternar barra lateral"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="stroke-red-500 transition-all"
                        [class.rotate-180]="!sidebarOpen()"
                        [class.stroke-red-700]="sidebarOpen()"
                        [class.stroke-white]="sidebarOpen()"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path
                            d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"
                        />
                        <path d="M9 4v16" />
                        <path d="M15 10l-2 2l2 2" />
                    </svg>
                </button>

                <h1 class="text-2xl font-semibold text-gray-800">{{ title() }}</h1>
            </div>

            <header-user-popover></header-user-popover>
        </header>
    `,
    imports: [HeaderUserPopover],
})
export class HeaderDashboard {
    readonly title = activeRouteTitle();
    readonly sidebarOpen = input(false);
    readonly toggleSidebar = output<void>();
}