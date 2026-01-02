import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { form, Field } from "@angular/forms/signals";
import { User } from "../../models/user.interface";
import { UserCompany } from "../../models/user-company.interface";
import { CompanyService, UpdateCompanyPayload } from "../../company.service";

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
    selector: 'app-profile',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Field],
    template: `
        @if (profile(); as user) {
        <div class="p-8 max-w-7xl mx-auto w-full">
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
                <div class="col-span-1">
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
                            <div class="flex  items-center gap-3 text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Miembro desde: <span class="font-medium text-gray-900">{{ user.memberSince }}</span></span>
                            </div>
                            <div class="flex  items-center gap-3 text-sm text-gray-600">
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
                    <section class="bg-surface-light rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 class="text-base font-semibold text-gray-800">Documentación Legal</h3>
                        </div>
                        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Tipo de Persona</label>
                                <div class="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">{{ user.personType }}</div>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Tipo de Documento</label>
                                <div class="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">{{ user.documentType }}</div>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Número de Documento</label>
                                <div class="flex items-center justify-between text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                    <span class="mt-1 font-sans font-semibold">{{ user.documentNumber }}</span>
                                    <button
                                        (click)="copyDocumentNumberToClipboard(user.documentNumber)"
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

                    <!-- Contact -->
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
                                        {{ user.email }}
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
                                        {{ user.phone }}
                                    </div>
                                }
                            </div>
                        </div>
                    </section>

                    <!-- Address -->
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
                                    <p class="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">{{ user.address }}</p>
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
                                    <p class="text-sm text-gray-700">{{ user.city }}</p>
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
                                    <p class="text-sm text-gray-700">{{ user.state }}</p>
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
                                    <p class="text-sm text-gray-700">{{ user.postalCode }}</p>
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
                                        {{ user.country }}
                                    </p>
                                }
                            </div>
                        </div>
                    </section>
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

    protected readonly profile = computed(() => {
        const user = this.user();
        const company = this.company();

        if (!user) return null;

        const isAdmin = user.role === 'ADMIN';

        return {
            avatarUrl: undefined as string | undefined,
            fullName: user.displayName,
            email: user.email,
            role: user.role === 'ADMIN' ? 'Administrador' : (user.role === 'AGENCY' ? 'Agencia' : 'Proveedor de Transporte'),
            isAdmin,
            isActive: user.status === 'ACTIVE',
            isVerified: user.status === 'ACTIVE',
            memberSince: new Date(user.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            personType: PERSON_TYPE_LABELS[company?.legalDocumentation?.personType ?? ''] ?? '',
            documentType: DOCUMENT_TYPE_LABELS[company?.legalDocumentation?.documentType ?? ''] ?? '',
            documentNumber: company?.legalDocumentation?.documentNumber ?? '',
            phone: company?.contact?.phoneNumber ?? company?.contact?.mobileNumber ?? '',
            address: company?.address?.street ?? '',
            city: company?.address?.city ?? '',
            state: company?.address?.state ?? '',
            postalCode: company?.address?.postalCode ?? '',
            country: company?.address?.country ?? '',
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

    private loadCompanyDetails(role: string): void {
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

    copyDocumentNumberToClipboard(documentNumber: string): void {
        navigator.clipboard.writeText(documentNumber).then(() => {
            console.log('Número de documento copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el número de documento: ', err);
        });
    }
}