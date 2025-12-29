import { Component, signal } from "@angular/core";

@Component({
    selector: 'header-user-popover',
    template: `
    <div class="relative flex items-center gap-4">
                <button
                    type="button"
                    (click)="handlePopoverToggle()"
                    class="px-2 py-1 cursor-pointer rounded-sm border border-red-700 hover:border-red-400 hover:bg-red-700 hover:text-white transition-all flex items-center gap-2 text-gray-600" [class.bg-red-700]="popoverOpen()" [class.text-white]="popoverOpen()"
                    aria-haspopup="menu"
                    [attr.aria-expanded]="popoverOpen()"
                    [attr.aria-controls]="menuId"
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
                        class="icon icon-tabler icons-tabler-outline icon-tabler-user-circle"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                    </svg>

                    <span class="font-sans">Admin User</span>
                </button>

                @if (popoverOpen()) {
                    <aside
                        class="animate-blurred-fade-in animate-duration-250 absolute bg-white shadow-lg rounded-lg border border-gray-100 top-10 right-0 w-fit"
                        [id]="menuId"
                        role="menu"
                        aria-label="Menú de usuario"
                        (keydown.escape)="closePopover()"
                    >
                        <ul class="flex flex-col [&>li]:flex [&>li]:items-center">
                            <li>
                                <button
                                    type="button"
                                    role="menuitem"
                                    class="w-full flex items-center text-left gap-2 cursor-pointer px-4 py-1.5 rounded-md hover:bg-red-100 transition-all text-gray-700"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 stroke-red-700"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
                                    <span>Perfil</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    role="menuitem"
                                    class="w-full flex items-center text-left gap-2 cursor-pointer px-4 py-1.5 rounded-md hover:bg-red-100 transition-all text-gray-700"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 stroke-red-700"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
                                    <span>Configuración</span>
                                </button>
                            </li>
                            <li class="border-t border-gray-200 pt-2">
                                <button
                                    type="button"
                                    role="menuitem"
                                    class="w-full flex items-center text-left gap-2 cursor-pointer px-4 py-1.5 rounded-md hover:bg-red-100 transition-all text-gray-700"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 stroke-red-700"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M15 12h-12l3 -3" /><path d="M6 15l-3 -3" /></svg>
                                    <span>Cerrar sesión</span>
                                </button>
                            </li>
                        </ul>
                    </aside>
                }
            </div>
            `,
    imports: []
})

export class HeaderUserPopover {
    readonly menuId = "header-dashboard-user-menu";
    popoverOpen = signal(false);

    handlePopoverToggle() {
        this.popoverOpen.update((value) => !value);
    }

    closePopover() {
        this.popoverOpen.set(false);
    }


}