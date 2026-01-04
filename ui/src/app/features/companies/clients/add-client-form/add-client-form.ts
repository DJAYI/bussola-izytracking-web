import { Component } from "@angular/core";
import { CompanyForm } from "../../../../lib/components/company-form/company-form";
import { UserRole } from "../../../../auth/models/role.enum";

@Component({
    selector: "app-add-client-form",
    template: `
        <app-company-form
            title="Nueva Agencia"
            description="Complete el formulario para registrar una nueva agencia en el sistema."
            [companyType]="companyType"
            submitButtonText="Crear Agencia"
            [cancelRoute]="['/admin', 'agencies']"
        />
    `,
    imports: [CompanyForm],
})
export class AddClientFormComponent {
    readonly companyType = UserRole.AGENCY;
}