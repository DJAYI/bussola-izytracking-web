import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserCompany } from "../../../auth/models/user-company.interface";
import { PaginatedResponse } from "../../../utils/paginated-response.interface";
import { Pagination } from "../pagination/pagination";

@Component({
    selector: "app-company-table",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="mb-6 flex max-w-7xl mx-auto justify-between items-end">
            <div>
                <h3 class="text-2xl font-bold">{{ title() }}</h3>
                <p>{{ description() }}</p>
            </div>
            <a 
                class="px-4 py-2 bg-red-200 text-red-800 font-semibold rounded-md hover:bg-red-300 transition-colors w-fit" 
                [routerLink]="addRoute()"
            >
                {{ addButtonText() }}
            </a>
        </div>
        
        <div class="relative max-w-7xl mx-auto mt-4 flex flex-col w-full h-full overflow-auto text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <table class="w-full text-left table-auto min-w-max">
                <thead>
                    <tr>
                        <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
                            <p class="block text-sm leading-none text-white font-semibold">Nombre</p>
                        </th>
                        <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
                            <p class="block text-sm leading-none text-white font-semibold">Documento Legal</p>
                        </th>
                        <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
                            <p class="block text-sm leading-none text-white font-semibold">Tipo de Persona</p>
                        </th>
                        <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
                            <p class="block text-sm leading-none text-white font-semibold">Dirección</p>
                        </th>
                        <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
                            <p class="block text-sm leading-none text-white font-semibold">Correo Electrónico</p>
                        </th>
                        <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
                            <p class="block text-sm leading-none text-white font-semibold">Teléfono</p>
                        </th>
                        <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
                            <p class="block text-sm leading-none text-white font-semibold">Acciones</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @for (company of data().content; track company.id; let last = $last) {
                        <tr class="hover:bg-slate-50">
                            <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                                <p class="block text-sm text-slate-800 flex items-center">
                                    <span class="inline-flex items-center justify-center p-2.5 rounded-full text-xs font-black size-10 leading-none bg-gray-200 text-gray-800 mr-2 text-center">
                                        {{ getInitials(company.displayName) }}
                                    </span>
                                    {{ company.displayName }}
                                </p>
                            </td>
                            <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                                <div class="flex items-center gap-2">
                                    <span 
                                        [class]="getDocumentTypePillClass(company.legalDocumentation.documentType)" 
                                        class="inline-flex items-center justify-center p-2.5 rounded-full text-xs font-black size-10 leading-none"
                                    >
                                        {{ company.legalDocumentation.documentType }}
                                    </span>
                                    <span class="text-slate-800 font-mono">
                                        {{ formatDocumentNumber(company.legalDocumentation.documentNumber) }}
                                    </span>
                                </div>
                            </td>
                            <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                                <p class="block text-sm text-slate-800">
                                    {{ company.legalDocumentation.personType === 'NATURAL' ? 'Natural' : 'Jurídica' }}
                                </p>
                            </td>
                            <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                                <p class="block text-sm text-slate-800">
                                    {{ company.address.street }}, {{ company.address.city }}
                                </p>
                            </td>
                            <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                                <p class="block text-sm text-slate-800">{{ company.contact.email }}</p>
                            </td>
                            <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                                <p class="block text-sm text-slate-800">{{ company.contact.phoneNumber }}</p>
                            </td>
                            <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                                <div class="flex gap-2">
                                    <button 
                                        type="button" 
                                        class="p-2 rounded-full cursor-pointer bg-neutral-100 hover:bg-gray-300 group text-sm font-semibold text-blue-600 hover:text-blue-800" 
                                        aria-label="Ver"
                                        (click)="edit.emit(company)"
                                    >
                                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    </button>
                                    <button 
                                        type="button" 
                                        class="p-2 rounded-full cursor-pointer bg-neutral-100 hover:bg-gray-300 group text-sm font-semibold text-red-600 hover:text-red-800" 
                                        aria-label="Eliminar"
                                        (click)="delete.emit(company)"
                                    >
                                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    } @empty {
                        <tr>
                            <td colspan="7" class="p-8 text-center text-slate-500 font-semibold">
                                {{ emptyMessage() }}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>

        <div class="max-w-7xl mx-auto mt-4">
            <app-pagination
                [currentPage]="data().page"
                [pageSize]="data().size"
                [totalElements]="data().totalElements"
                [totalPages]="data().totalPages"
                [isFirst]="data().first"
                [isLast]="data().last"
                (pageChange)="pageChange.emit($event)"
                (pageSizeChange)="pageSizeChange.emit($event)"
            />
        </div>
    `,
    imports: [Pagination, RouterLink],
})
export class CompanyTable {
    // Inputs
    data = input.required<PaginatedResponse<UserCompany>>();
    title = input.required<string>();
    description = input.required<string>();
    addButtonText = input.required<string>();
    addRoute = input<string | string[]>(['new']);
    emptyMessage = input<string>('No se encontraron registros');

    // Outputs
    pageChange = output<number>();
    pageSizeChange = output<number>();
    edit = output<UserCompany>();
    delete = output<UserCompany>();

    getInitials(displayName: string): string {
        const parts = displayName.split(' ');
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return displayName.substring(0, 2).toUpperCase();
    }

    getDocumentTypePillClass(documentType: string): string {
        switch (documentType) {
            case 'CC':
                return 'bg-blue-100 text-blue-800';
            case 'CE':
                return 'bg-green-100 text-green-800';
            case 'NIT':
                return 'bg-yellow-100 text-yellow-800';
            case 'RUT':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    formatDocumentNumber(documentNumber: string): string {
        if (documentNumber.length === 10) {
            return documentNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
        } else if (documentNumber.length === 9) {
            return documentNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        }
        return documentNumber;
    }
}
