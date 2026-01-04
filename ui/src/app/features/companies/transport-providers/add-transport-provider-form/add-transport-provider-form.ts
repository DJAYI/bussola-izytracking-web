import { Component } from "@angular/core";
import { CompanyForm } from "../../../../lib/components/company-form/company-form";
import { UserRole } from "../../../../auth/models/role.enum";

@Component({
    selector: "app-add-transport-provider-form",
    template: `
        <app-company-form
            title="Nuevo Proveedor de Transporte"
            description="Complete el formulario para registrar un nuevo proveedor de transporte en el sistema."
            [companyType]="companyType"
            submitButtonText="Crear Proveedor"
            [cancelRoute]="['/admin', 'transport-providers']"
        />
    `,
    imports: [CompanyForm],
})
export class AddTransportProviderFormComponent {
    readonly companyType = UserRole.TRANSPORT_PROVIDER;
}