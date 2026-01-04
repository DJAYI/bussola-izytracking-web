import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { form } from "@angular/forms/signals";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CompanyService, UpdateCompanyPayload } from "../../company.service";
import { UserCompany } from "../../../../auth/models/user-company.interface";
import { UserRole } from "../../../../auth/models/role.enum";
import { getDocumentTypeLabel } from "../../../../shared/constants/document-types.constant";
import { getPersonTypeLabel } from "../../../../shared/constants/person-types.constant";
import { CompanyEditFormModel, createEmptyCompanyEditFormModel } from "../../shared/models";
import {
    LegalDocsSectionComponent,
    ContactSectionComponent,
    AddressSectionComponent,
    CompanyCardComponent,
    CompanyCardVariant
} from "../../shared/components";

@Component({
    selector: "app-modify-client-form",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, LegalDocsSectionComponent, ContactSectionComponent, AddressSectionComponent, CompanyCardComponent],
    template: `
        @if (isLoading()) {
            <div class="max-w-7xl mx-auto w-full flex items-center justify-center">
                <div class="text-gray-500">Cargando información...</div>
            </div>
        } @else if (company(); as companyData) {
            <div class="max-w-7xl mx-auto w-full">
                <div class="mb-8 flex items-center justify-between">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Modificar Agencia</h3>
                        <p class="text-gray-500 mt-1">Edite la información de contacto y dirección de la compañía.</p>
                    </div>
                    @if (isEditing()) {
                        <div class="flex gap-2">
                            <button 
                                type="button"
                                (click)="cancelEditing()"
                                class="text-gray-600 hover:cursor-pointer px-5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md font-medium flex items-center gap-1 transition-colors">
                                Cancelar
                            </button>
                            <button 
                                type="button"
                                (click)="saveChanges()"
                                [disabled]="isSaving()"
                                class="text-white hover:cursor-pointer px-5 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md font-medium flex items-center gap-1 transition-colors">
                                @if (isSaving()) {
                                    Guardando...
                                } @else {
                                    Guardar Cambios
                                }
                            </button>
                        </div>
                    } @else {
                        <div class="flex gap-2">
                            <a
                                [routerLink]="['/admin', 'agencies']"
                                class="text-gray-600 hover:cursor-pointer px-5 py-1 bg-gray-100 hover:bg-gray-200 ring ring-gray-300 rounded-md font-medium flex items-center gap-1 transition-colors">
                                Volver
                            </a>
                            <button
                                type="button"
                                (click)="startEditing()"
                                class="text-yellow-600 hover:cursor-pointer border px-5 py-1 bg-white hover:bg-yellow-500 rounded-md hover:text-black hover:border-yellow-500 font-medium flex items-center gap-1 transition-colors">
                                Editar Información
                            </button>
                        </div>
                    }
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Company Card -->
                    <div class="col-span-1">
                        <app-company-card
                            [displayName]="companyData.displayName"
                            [email]="companyData.contact.email"
                            [variant]="CompanyCardVariant.AGENCY"
                        />
                    </div>

                    <!-- Info Cards -->
                    <div class="col-span-1 lg:col-span-2 space-y-6">
                        <!-- Legal Documentation (Read Only) -->
                        <app-legal-docs-section
                            [personTypeLabel]="personTypeLabel()"
                            [documentTypeLabel]="documentTypeLabel()"
                            [documentNumber]="companyData.legalDocumentation.documentNumber"
                            [showReadOnlyBadge]="true"
                            (copyRequested)="copyToClipboard($event)"
                        />

                        <!-- Contact (Editable) -->
                        <app-contact-section
                            [isEditing]="isEditing()"
                            [email]="companyData.contact.email"
                            [phoneNumber]="companyData.contact.phoneNumber || companyData.contact.mobileNumber || ''"
                            [emailField]="editForm.email"
                            [phoneField]="editForm.phoneNumber"
                        />

                        <!-- Address (Editable) -->
                        <app-address-section
                            [isEditing]="isEditing()"
                            [street]="companyData.address.street"
                            [city]="companyData.address.city"
                            [state]="companyData.address.state"
                            [postalCode]="companyData.address.postalCode"
                            [country]="companyData.address.country"
                            [streetField]="editForm.street"
                            [cityField]="editForm.city"
                            [stateField]="editForm.state"
                            [postalCodeField]="editForm.postalCode"
                            [countryField]="editForm.country"
                        />
                    </div>
                </div>
            </div>
        } @else {
            <div class="p-8 max-w-7xl mx-auto w-full flex items-center justify-center">
                <div class="text-red-500">Error al cargar la información de la compañía.</div>
            </div>
        }
    `,
})
export class ModifyClientFormComponent implements OnInit {
    private readonly companyService = inject(CompanyService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly CompanyCardVariant = CompanyCardVariant;

    protected readonly company = signal<UserCompany | null>(null);
    protected readonly isLoading = signal(true);
    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);

    private companyId = '';

    protected readonly formModel = signal<CompanyEditFormModel>(createEmptyCompanyEditFormModel());

    protected readonly editForm = form(this.formModel);

    protected readonly personTypeLabel = computed(() => {
        const companyData = this.company();
        return getPersonTypeLabel(companyData?.legalDocumentation?.personType);
    });

    protected readonly documentTypeLabel = computed(() => {
        const companyData = this.company();
        return getDocumentTypeLabel(companyData?.legalDocumentation?.documentType);
    });

    ngOnInit(): void {
        this.companyId = this.route.snapshot.paramMap.get('id') ?? '';
        if (this.companyId) {
            this.loadCompanyDetails();
        } else {
            this.isLoading.set(false);
        }
    }

    private loadCompanyDetails(): void {
        this.companyService.getCompanyById(UserRole.AGENCY, this.companyId).subscribe({
            next: ({ data: companyData }) => {
                this.company.set(companyData);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading company details:', err);
                this.isLoading.set(false);
            }
        });
    }

    protected startEditing(): void {
        const companyData = this.company();
        this.formModel.set({
            street: companyData?.address?.street ?? '',
            city: companyData?.address?.city ?? '',
            state: companyData?.address?.state ?? '',
            postalCode: companyData?.address?.postalCode ?? '',
            country: companyData?.address?.country ?? '',
            email: companyData?.contact?.email ?? '',
            phoneNumber: companyData?.contact?.phoneNumber ?? ''
        });
        this.isEditing.set(true);
    }

    protected cancelEditing(): void {
        this.isEditing.set(false);
    }

    protected saveChanges(): void {
        if (!this.companyId) return;

        const formValue = this.formModel();
        const payload: UpdateCompanyPayload = {
            addressDetails: {
                street: formValue.street,
                city: formValue.city,
                state: formValue.state,
                postalCode: formValue.postalCode,
                country: formValue.country
            },
            contactInformation: {
                email: formValue.email,
                phoneNumber: formValue.phoneNumber
            }
        };

        this.isSaving.set(true);
        this.companyService.updateCompanyById(UserRole.AGENCY, this.companyId, payload).subscribe({
            next: ({ data: updatedCompany }) => {
                this.company.set(updatedCompany);
                this.isEditing.set(false);
                this.isSaving.set(false);
            },
            error: (err) => {
                console.error('Error updating company details:', err);
                this.isSaving.set(false);
            }
        });
    }

    protected copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Texto copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar: ', err);
        });
    }
}