import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { form } from "@angular/forms/signals";
import { User } from "../../models/user.interface";
import { UserCompany } from "../../models/user-company.interface";
import { CompanyService, UpdateCompanyPayload } from "../../../features/companies/company.service";
import { UserRole } from "../../models/role.enum";
import { UserStatus } from "../../models/user-status.enum";
import { getDocumentTypeLabel } from "../../../shared/constants/document-types.constant";
import { getPersonTypeLabel } from "../../../shared/constants/person-types.constant";
import { CompanyEditFormModel, createEmptyCompanyEditFormModel } from "../../../features/companies/shared/models";
import { copyToClipboard } from "../../../utils/clipboard.util";
import {
    LegalDocsSectionComponent,
    ContactSectionComponent,
    AddressSectionComponent
} from "../../../features/companies/shared/components";

@Component({
    selector: 'app-profile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LegalDocsSectionComponent, ContactSectionComponent, AddressSectionComponent],
    template: `
        @if (profile(); as user) {
        <div class="max-w-7xl mx-auto w-full">
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900">Información del Usuario</h3>
                    <p class="text-gray-500 mt-1">Gestione su información personal, legal y de contacto.</p>
                </div>
                @if (isEditing()) {
                    <div class="flex gap-2">
                        <button 
                            type="button"
                            (click)="cancelEditing()"
                            class="text-gray-600 hover:cursor-pointer px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium flex items-center gap-1 transition-colors">
                            Cancelar
                        </button>
                        <button 
                            type="button"
                            (click)="saveChanges()"
                            [disabled]="isSaving()"
                            class="text-white hover:cursor-pointer px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md font-medium flex items-center gap-1 transition-colors">
                            @if (isSaving()) {
                                Guardando...
                            } @else {
                                Guardar Cambios
                            }
                        </button>
                    </div>
                } @else if (!user.isAdmin) {
                    <button 
                        type="button"
                        (click)="startEditing()"
                        class="text-blue-500 hover:cursor-pointer px-5 py-2 outline bg-white hover:bg-black rounded-md hover:text-white font-medium flex items-center gap-1 transition-colors">
                        Editar Perfil
                    </button>
                }
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Profile Card -->
                <div class="col-span-1" [class.col-span-3]="user.isAdmin">
                    <div class="bg-surface-light rounded-xl shadow-sm border border-gray-200 p-6 text-center h-full">
                        <div class="relative inline-block">
                            <img 
                                alt="Foto de perfil del usuario" 
                                class="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover" 
                                [src]="user.avatarUrl" 
                            />
                            @if (user.isActive) {
                                <div 
                                    class="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" 
                                    title="Activo"
                                    role="status"
                                    aria-label="Usuario activo">
                                </div>
                            }
                        </div>
                        <h2 class="mt-4 text-xl font-bold text-gray-900">{{ user.fullName }}</h2>
                        <p class="text-sm text-gray-500">{{ user.email }}</p>
                        <div class="mt-4 inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            {{ user.role }}
                        </div>
                        <div class="mt-8 border-t flex flex-col items-stretch w-full mx-4 border-gray-100 pt-6 text-left space-y-4">
                            <div class="flex items-center gap-3 text-sm text-gray-600" [class.justify-center]="user.isAdmin">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Miembro desde: <span class="font-medium text-gray-900">{{ user.memberSince }}</span></span>
                            </div>
                            <div class="flex  items-center gap-3 text-sm text-gray-600" [class.justify-center]="user.isAdmin">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2l4 -4m6 2a9 9 0 1 1 -18 0a9 9 0 0 1 18 0z" />
                                    </svg>
                                </span>
                                <span>Estado: 
                                    @if (user.isVerified) {
                                        <span class="font-medium text-green-600">Verificado</span>
                                    } @else {
                                        <span class="font-medium text-yellow-600">Pendiente</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Info Cards -->
                @if (!user.isAdmin) {
                <div class="col-span-1 lg:col-span-2 space-y-6">
                    <!-- Legal Documentation -->
                    <app-legal-docs-section
                        [personTypeLabel]="user.personType"
                        [documentTypeLabel]="user.documentType"
                        [documentNumber]="user.documentNumber"
                        (copyRequested)="copyToClipboard($event)"
                    />

                    <!-- Contact -->
                    <app-contact-section
                        [isEditing]="isEditing()"
                        [email]="user.contactEmail"
                        [phoneNumber]="user.phone"
                        [emailField]="editForm.email"
                        [phoneField]="editForm.phoneNumber"
                    />

                    <!-- Address -->
                    <app-address-section
                        [isEditing]="isEditing()"
                        [street]="user.address"
                        [city]="user.city"
                        [state]="user.state"
                        [postalCode]="user.postalCode"
                        [country]="user.country"
                        [streetField]="editForm.street"
                        [cityField]="editForm.city"
                        [stateField]="editForm.state"
                        [postalCodeField]="editForm.postalCode"
                        [countryField]="editForm.country"
                        (stateReset)="onStateReset()"
                        (cityReset)="onCityReset()"
                    />
                </div>
                }
            </div>
        </div>
        }
    `
})
export class ProfilePage implements OnInit {
    private readonly companyService = inject(CompanyService);

    private readonly user = signal<User | null>(null);
    private readonly company = signal<UserCompany | null>(null);

    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);

    protected readonly formModel = signal<CompanyEditFormModel>(createEmptyCompanyEditFormModel());

    protected readonly editForm = form(this.formModel);

    protected readonly profile = computed(() => {
        const user = this.user();
        const company = this.company();

        if (!user) return null;

        const isAdmin = user.role === UserRole.ADMIN;

        return {
            avatarUrl: undefined as string | undefined,
            fullName: user.displayName,
            email: user.email,
            role: user.role === UserRole.ADMIN ? 'Administrador' : (user.role === UserRole.AGENCY ? 'Agencia' : 'Proveedor de Transporte'),
            isAdmin,
            isActive: user.status === UserStatus.ACTIVE,
            isVerified: user.status === UserStatus.ACTIVE,
            memberSince: new Date(user.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            personType: getPersonTypeLabel(company?.legalDocumentation?.personType),
            documentType: getDocumentTypeLabel(company?.legalDocumentation?.documentType),
            documentNumber: company?.legalDocumentation?.documentNumber ?? '',
            phone: company?.contact?.phoneNumber ?? company?.contact?.mobileNumber ?? '',
            address: company?.address?.street ?? '',
            city: company?.address?.city ?? '',
            state: company?.address?.state ?? '',
            postalCode: company?.address?.postalCode ?? '',
            country: company?.address?.country ?? '',
            contactEmail: company?.contact?.email ?? ''
        };
    });

    ngOnInit(): void {
        this.loadProfile();
    }

    private loadProfile(): void {
        this.companyService.getAuthenticatedUser().subscribe({
            next: ({ data: user }) => {
                this.user.set(user);
                if (user.role !== 'ADMIN') {
                    this.loadCompanyDetails(user.role);
                }
            },
            error: (err) => console.error('Error loading profile:', err)
        });
    }

    private loadCompanyDetails(role: UserRole): void {
        this.companyService.getCompanyDetails(role).subscribe({
            next: ({ data: company }) => this.company.set(company),
            error: (err) => console.error('Error loading company details:', err)
        });
    }

    protected startEditing(): void {
        const company = this.company();
        this.formModel.set({
            street: company?.address?.street ?? '',
            city: company?.address?.city ?? '',
            state: company?.address?.state ?? '',
            postalCode: company?.address?.postalCode ?? '',
            country: company?.address?.country ?? '',
            email: company?.contact?.email ?? '',
            phoneNumber: company?.contact?.phoneNumber ?? ''
        });
        this.isEditing.set(true);
    }

    protected cancelEditing(): void {
        this.isEditing.set(false);
    }

    protected saveChanges(): void {
        const user = this.user();
        if (!user) return;

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
        this.companyService.updateCompanyDetails(user.role, payload).subscribe({
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
        copyToClipboard(text);
    }

    protected onStateReset(): void {
        this.formModel.update(model => ({ ...model, state: '', city: '' }));
    }

    protected onCityReset(): void {
        this.formModel.update(model => ({ ...model, city: '' }));
    }
}