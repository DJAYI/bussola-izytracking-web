import { Component, inject, OnInit, signal } from "@angular/core";
import { CompanyService } from "../../../../auth/company.service";
import { Pagination } from "../../../../lib/components/pagination/pagination";
import { PaginatedResponse, PaginationParams } from "../../../../utils/paginated-response.interface";
import { UserCompany } from "../../../../auth/models/user-company.interface";
import { AuthService } from "../../../../auth/auth,service";

@Component({
    selector: "app-retrieve-clients",
    template: `
    <div class="relative flex flex-col w-full h-full overflow-auto text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
      <table class="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Nombre</p>
            </th>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Tipo de Identificación</p>
            </th>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Número de Identificación</p>
            </th>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Tipo de Persona</p>
            </th>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Dirección</p>
            </th>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Correo Electrónico</p>
            </th>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Teléfono</p>
            </th>
            <th class="p-4 border-b border-slate-300 bg-red-700 text-white">
              <p class="block text-sms leading-none text-white font-semibold">Acciones</p>
            </th>
          </tr>
        </thead>
        <tbody>
          @for (client of paginatedData().content; track client.id; let last = $last) {
            <tr class="hover:bg-slate-50">
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <p class="block text-sm text-slate-800">{{ client.displayName }}</p>
              </td>
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <p class="block text-sm text-slate-800">{{ client.legalDocumentation.documentType }}</p>
              </td>
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <p class="block text-sm text-slate-800">{{ client.legalDocumentation.documentNumber }}</p>
              </td>
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <p class="block text-sm text-slate-800">{{ client.legalDocumentation.personType === 'NATURAL' ? 'Natural' : 'Jurídica' }}</p>
              </td>
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <p class="block text-sm text-slate-800">{{ client.address.street }}, {{ client.address.city }}</p>
              </td>
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <p class="block text-sm text-slate-800">{{ client.contact.email }}</p>
              </td>
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <p class="block text-sm text-slate-800">{{ client.contact.phoneNumber }}</p>
              </td>
              <td class="p-4" [class.border-b]="!last" [class.border-slate-200]="!last">
                <div class="flex gap-2">
                  <button type="button" class="text-sm font-semibold text-blue-600 hover:text-blue-800">
                    Editar
                  </button>
                  <button type="button" class="text-sm font-semibold text-red-600 hover:text-red-800">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="8" class="p-8 text-center text-white font-semibold">
                No se encontraron clientes
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <app-pagination
      [currentPage]="paginatedData().page"
      [pageSize]="paginatedData().size"
      [totalElements]="paginatedData().totalElements"
      [totalPages]="paginatedData().totalPages"
      [isFirst]="paginatedData().first"
      [isLast]="paginatedData().last"
      (pageChange)="onPageChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    />
    `,
    imports: [Pagination],
})
export class RetrieveClientsComponent implements OnInit {
    authService = inject(AuthService);
    companyService = inject(CompanyService);

    paginatedData = signal<PaginatedResponse<UserCompany>>({
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
    });

    onPageChange(page: number): void {
        this.loadData({ page, size: this.paginatedData().size });
    }

    onPageSizeChange(size: number): void {
        this.loadData({ page: 0, size }); // Reset to first page
    }

    loadData(params: PaginationParams): void {
        this.companyService.getListOfCompanies("AGENCY", params).subscribe({
            next: (response) => {
                this.paginatedData.set(response.data);
                console.log("Fetched clients:", response.data);
            },
            error: (error) => {
                console.error("Error fetching clients:", error);
            }
        });
    }

    ngOnInit(): void {
        this.loadData({ page: 0, size: 10 });
    }
}