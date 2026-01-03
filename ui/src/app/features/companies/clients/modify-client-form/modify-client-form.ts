import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { form, Field } from "@angular/forms/signals";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CompanyService, UpdateCompanyPayload } from "../../../../auth/company.service";
import { UserCompany } from "../../../../auth/models/user-company.interface";

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
    'NIT': 'NIT',
    'CC': 'Cédula de Ciudadanía',
    'CE': 'Cédula de Extranjería',
    'RUT': 'RUT'
};

const PERSON_TYPE_LABELS: Record<string, string> = {
    'NATURAL': 'Natural',
    'JURIDICAL': 'Jurídica'
};

interface EditFormModel {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    phoneNumber: string;
}

@Component({
    selector: "app-modify-client-form",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Field, RouterLink],
    template: `
        @if (isLoading()) {
            <div class="p-8 max-w-7xl mx-auto w-full flex items-center justify-center">
                <div class="text-gray-500">Cargando información...</div>
            </div>
        } @else if (company(); as companyData) {
            <div class="p-8 max-w-7xl mx-auto w-full">
                <div class="mb-8 flex items-center justify-between">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">Modificar Cliente</h3>
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
                        <div class="bg-surface-light rounded-xl shadow-sm border border-gray-200 p-6 text-center h-full">
                            <div class="relative inline-block">
                                <div class="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg bg-green-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="size-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <h2 class="mt-4 text-xl font-bold text-gray-900">{{ companyData.displayName }}</h2>
                            <p class="text-sm text-gray-500">{{ companyData.contact.email }}</p>
                            <div class="mt-4 inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                Cliente / Agencia
                            </div>
                        </div>
                    </div>

                    <!-- Info Cards -->
                    <div class="col-span-1 lg:col-span-2 space-y-6">
                        <!-- Legal Documentation (Read Only) -->
                        <section class="bg-surface-light rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 class="text-base font-semibold text-gray-800">Documentación Legal</h3>
                                <span class="ml-auto text-xs text-gray-400">(Solo lectura)</span>
                            </div>
                            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Tipo de Persona</label>
                                    <div class="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">{{ personTypeLabel() }}</div>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Tipo de Documento</label>
                                    <div class="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">{{ documentTypeLabel() }}</div>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Número de Documento</label>
                                    <div class="flex items-center justify-between text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                        <span class="mt-1 font-sans font-semibold">{{ companyData.legalDocumentation.documentNumber }}</span>
                                        <button
                                            (click)="copyToClipboard(companyData.legalDocumentation.documentNumber)"
                                            type="button" 
                                            class="text-gray-400 text-sm cursor-pointer p-2 border bg-gray-200 border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            aria-label="Copiar número de documento">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Contact (Editable) -->
                        <section class="bg-surface-light rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <h3 class="text-base font-semibold text-gray-800">Contacto</h3>
                            </div>
                            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Correo Electrónico</label>
                                    @if (isEditing()) {
                                        <input 
                                            type="email"
                                            [field]="editForm.email"
                                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            aria-label="Correo Electrónico"
                                        />
                                    } @else {
                                        <div class="flex items-center gap-2 text-sm text-gray-900">
                                            {{ companyData.contact.email }}
                                        </div>
                                    }
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Número de Teléfono</label>
                                    @if (isEditing()) {
                                        <input 
                                            type="tel"
                                            [field]="editForm.phoneNumber"
                                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            aria-label="Número de Teléfono"
                                        />
                                    } @else {
                                        <div class="flex items-center gap-2 text-sm text-gray-900">
                                            {{ companyData.contact.phoneNumber || companyData.contact.mobileNumber }}
                                        </div>
                                    }
                                </div>
                            </div>
                        </section>

                        <!-- Address (Editable) -->
                        <section class="bg-surface-light rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 class="text-base font-semibold text-gray-800">Dirección</h3>
                            </div>
                            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Calle / Dirección</label>
                                    @if (isEditing()) {
                                        <input 
                                            type="text"
                                            [field]="editForm.street"
                                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            aria-label="Calle / Dirección"
                                        />
                                    } @else {
                                        <p class="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">{{ companyData.address.street }}</p>
                                    }
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Ciudad</label>
                                    @if (isEditing()) {
                                        <input 
                                            type="text"
                                            [field]="editForm.city"
                                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            aria-label="Ciudad"
                                        />
                                    } @else {
                                        <p class="text-sm text-gray-700">{{ companyData.address.city }}</p>
                                    }
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Estado / Departamento</label>
                                    @if (isEditing()) {
                                        <input 
                                            type="text"
                                            [field]="editForm.state"
                                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            aria-label="Estado / Departamento"
                                        />
                                    } @else {
                                        <p class="text-sm text-gray-700">{{ companyData.address.state }}</p>
                                    }
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Código Postal</label>
                                    @if (isEditing()) {
                                        <input 
                                            type="text"
                                            [field]="editForm.postalCode"
                                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            aria-label="Código Postal"
                                        />
                                    } @else {
                                        <p class="text-sm text-gray-700">{{ companyData.address.postalCode }}</p>
                                    }
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">País</label>
                                    @if (isEditing()) {
                                        <input 
                                            type="text"
                                            [field]="editForm.country"
                                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            aria-label="País"
                                        />
                                    } @else {
                                        <p class="text-sm text-gray-700 flex items-center gap-2">
                                            {{ companyData.address.country }}
                                        </p>
                                    }
                                </div>
                            </div>
                        </section>
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

    protected readonly company = signal<UserCompany | null>(null);
    protected readonly isLoading = signal(true);
    protected readonly isEditing = signal(false);
    protected readonly isSaving = signal(false);

    private companyId = '';

    protected readonly formModel = signal<EditFormModel>({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        email: '',
        phoneNumber: ''
    });

    protected readonly editForm = form(this.formModel);

    protected readonly personTypeLabel = computed(() => {
        const companyData = this.company();
        return PERSON_TYPE_LABELS[companyData?.legalDocumentation?.personType ?? ''] ?? '';
    });

    protected readonly documentTypeLabel = computed(() => {
        const companyData = this.company();
        return DOCUMENT_TYPE_LABELS[companyData?.legalDocumentation?.documentType ?? ''] ?? '';
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
        this.companyService.getCompanyById('AGENCY', this.companyId).subscribe({
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
        this.companyService.updateCompanyById('AGENCY', this.companyId, payload).subscribe({
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