import { Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CompanyService } from "../../company.service";
import { CompanyTable } from "../../../../lib/components/company-table/company-table";
import { PaginatedResponse, PaginationParams } from "../../../../utils/paginated-response.interface";
import { UserCompany } from "../../../../auth/models/user-company.interface";

@Component({
    selector: "app-retrieve-transport-providers",
    template: `
        <app-company-table
            [data]="paginatedData()"
            title="Listado de Proveedores de Transporte"
            description="Aquí puedes ver y gestionar todos los proveedores de transporte registrados en el sistema."
            addButtonText="Agregar Nuevo Proveedor"
            emptyMessage="No se encontraron proveedores de transporte"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"
            (edit)="onEdit($event)"
            (delete)="onDelete($event)"
        />
    `,
    imports: [CompanyTable],
})
export class RetrieveTransportProvidersComponent implements OnInit {
    private companyService = inject(CompanyService);
    private router = inject(Router);

    paginatedData = signal<PaginatedResponse<UserCompany>>({
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
    });

    ngOnInit(): void {
        this.loadData({ page: 0, size: 10 });
    }

    onPageChange(page: number): void {
        this.loadData({ page, size: this.paginatedData().size });
    }

    onPageSizeChange(size: number): void {
        this.loadData({ page: 0, size });
    }

    onEdit(company: UserCompany): void {
        this.router.navigate(['admin', 'transport-providers', company.id, 'edit']);
    }

    onDelete(company: UserCompany): void {
        // TODO: Implementar lógica de eliminación
        console.log('Delete company:', company);
    }

    private loadData(params: PaginationParams): void {
        this.companyService.getListOfCompanies("TRANSPORT_PROVIDER", params).subscribe({
            next: (response) => {
                this.paginatedData.set(response.data);
            },
            error: (error) => {
                console.error("Error fetching transport providers:", error);
            }
        });
    }
}