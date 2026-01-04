import { Component, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CompanyService } from "../../company.service";
import { CompanyTable } from "../../../../lib/components/company-table/company-table";
import { PaginatedResponse, PaginationParams } from "../../../../utils/paginated-response.interface";
import { UserCompany } from "../../../../auth/models/user-company.interface";

@Component({
    selector: "app-retrieve-clients",
    template: `
        <app-company-table
            [data]="paginatedData()"
            title="Listado de Agencias"
            description="Aquí puedes ver y gestionar todas las agencias registradas en el sistema."
            addButtonText="Agregar Nueva Agencia"
            emptyMessage="No se encontraron agencias"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"
            (edit)="onEdit($event)"
            (delete)="onDelete($event)"
        />
    `,
    imports: [CompanyTable],
})
export class RetrieveClientsComponent implements OnInit {
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
        this.router.navigate(['admin', 'agencies', company.id, 'edit']);
    }

    onDelete(company: UserCompany): void {
        // TODO: Implementar lógica de eliminación
        console.log('Delete company:', company);
    }

    private loadData(params: PaginationParams): void {
        this.companyService.getListOfCompanies("AGENCY", params).subscribe({
            next: (response) => {
                this.paginatedData.set(response.data);
            },
            error: (error) => {
                console.error("Error fetching agencies:", error);
            }
        });
    }
}