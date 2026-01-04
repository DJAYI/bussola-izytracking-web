import { ChangeDetectionStrategy, Component, inject, input, output, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CompanyService } from "../../../auth/company.service";
import { CreateCompanyRequest } from "../../../auth/models/create-company.interface";
import { UserRole } from "../../../auth/models/role.enum";
import { COUNTRIES } from "../../../shared/constants/countries.constant";
import { DOCUMENT_TYPES, getDocumentTypesByPersonType, DocumentTypeOption } from "../../../shared/constants/document-types.constant";
import { PERSON_TYPES, PersonType } from "../../../shared/constants/person-types.constant";

@Component({
    selector: "app-company-form",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    template: `
        <div class="max-w-4xl mx-auto">
            <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-900">{{ title() }}</h3>
                <p class="text-gray-500 mt-1">{{ description() }}</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
                <!-- Información General -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h4 class="text-base font-semibold text-gray-800">Información General</h4>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label for="displayName" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Nombre de la Empresa <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="displayName" 
                                formControlName="displayName"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ej: Mi Empresa S.A.S"
                            />
                            @if (form.get('displayName')?.touched && form.get('displayName')?.errors?.['required']) {
                                <p class="mt-1 text-sm text-red-600">El nombre es requerido</p>
                            }
                        </div>
                        <div>
                            <label for="email" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Correo Electrónico <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                formControlName="email"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="correo@empresa.com"
                            />
                            @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
                                <p class="mt-1 text-sm text-red-600">El correo es requerido</p>
                            }
                            @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                                <p class="mt-1 text-sm text-red-600">Ingrese un correo válido</p>
                            }
                        </div>
                        <div>
                            <label for="password" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Contraseña <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="password" 
                                id="password" 
                                formControlName="password"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Mínimo 8 caracteres"
                            />
                            @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
                                <p class="mt-1 text-sm text-red-600">La contraseña es requerida</p>
                            }
                            @if (form.get('password')?.touched && form.get('password')?.errors?.['minlength']) {
                                <p class="mt-1 text-sm text-red-600">Mínimo 8 caracteres</p>
                            }
                        </div>
                    </div>
                </section>

                <!-- Documentación Legal -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 class="text-base font-semibold text-gray-800">Documentación Legal</h4>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6" formGroupName="legalDocumentationDetails">
                        <div>
                            <label for="personType" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Tipo de Persona <span class="text-red-500">*</span>
                            </label>
                            <select 
                                id="personType" 
                                (change)="onPersonTypeSelected()"
                                formControlName="personType"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                                <option value="" disabled>Seleccione...</option>
                                @for (type of personTypes; track type.value) {
                                    <option [value]="type.value">{{ type.label }}</option>
                                }
                            </select>
                        </div>
                        <div>
                            <label for="documentType" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Tipo de Documento <span class="text-red-500">*</span>
                            </label>
                            <select 
                                id="documentType" 
                                formControlName="documentType"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                            @if (form.get('legalDocumentationDetails.personType')?.value == null) {
                                <option disabled>Seleccione un tipo de persona primero</option>
                            } @else {
                                    <option value="" disabled>Seleccione...</option>
                                @for (type of documentTypes; track type.value) {
                                    <option [value]="type.value">{{ type.label }}</option>
                                }
                            }
                            </select>
                        </div>
                        <div>
                            <label for="documentNumber" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Número de Documento <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="documentNumber" 
                                formControlName="documentNumber"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-mono"
                                placeholder="Ej: 900123456"
                            />
                        </div>
                    </div>
                </section>

                <!-- Dirección -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h4 class="text-base font-semibold text-gray-800">Dirección</h4>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6" formGroupName="addressDetails">
                        <div class="md:col-span-2">
                            <label for="street" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Dirección <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="street" 
                                formControlName="street"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Calle 123 # 45-67"
                            />
                        </div>
                        <div>
                            <label for="city" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Ciudad <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="city" 
                                formControlName="city"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ej: Bogotá"
                            />
                        </div>
                        <div>
                            <label for="state" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Departamento / Estado <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="state" 
                                formControlName="state"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ej: Cundinamarca"
                            />
                        </div>
                        <div>
                            <label for="postalCode" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Código Postal <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="postalCode" 
                                formControlName="postalCode"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ej: 110111"
                            />
                        </div>
                        <div>
                            <label for="country" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                País <span class="text-red-500">*</span>
                            </label>
                            <select 
                                id="country" 
                                formControlName="country"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                                <option value="" disabled>Seleccione...</option>
                                @for (country of countries; track country.value) {
                                    <option [value]="country.value">{{ country.label }}</option>
                                }
                            </select>
                        </div>
                    </div>
                </section>

                <!-- Información de Contacto -->
                <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <h4 class="text-base font-semibold text-gray-800">Información de Contacto</h4>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6" formGroupName="contactInformation">
                        <div>
                            <label for="contactEmail" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Correo de Contacto <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="contactEmail" 
                                formControlName="email"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="contacto@empresa.com"
                            />
                        </div>
                        <div>
                            <label for="phoneNumber" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Teléfono <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="tel" 
                                id="phoneNumber" 
                                formControlName="phoneNumber"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ej: 3001234567"
                            />
                        </div>
                    </div>
                </section>

                <!-- Botones de acción -->
                <div class="flex justify-end gap-4 pt-4">
                    <button 
                        type="button"
                        (click)="onCancel()"
                        class="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        [disabled]="isSubmitting() || form.invalid"
                        class="px-6 py-2.5 text-white bg-red-700 hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        @if (isSubmitting()) {
                            <svg class="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        } @else {
                            {{ submitButtonText() }}
                        }
                    </button>
                </div>
            </form>
        </div>
    `,
})
export class CompanyForm {
    private fb = inject(FormBuilder);
    private companyService = inject(CompanyService);
    private router = inject(Router);

    // Inputs
    title = input.required<string>();
    description = input.required<string>();
    companyType = input.required<UserRole>();
    submitButtonText = input<string>('Crear Empresa');
    cancelRoute = input.required<string[]>();

    // Outputs
    created = output<void>();

    // State
    isSubmitting = signal(false);

    // Constants
    documentTypes: DocumentTypeOption[] = DOCUMENT_TYPES;
    personTypes = PERSON_TYPES;
    countries = COUNTRIES;

    form = this.fb.group({
        displayName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        legalDocumentationDetails: this.fb.group({
            documentNumber: ['', [Validators.required]],
            documentType: ['', [Validators.required]],
            personType: ['', [Validators.required]]
        }),
        addressDetails: this.fb.group({
            street: ['', [Validators.required]],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            postalCode: ['', [Validators.required]],
            country: ['', [Validators.required]]
        }),
        contactInformation: this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required]]
        })
    });

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);

        const payload = this.form.getRawValue() as CreateCompanyRequest;

        this.companyService.createCompany(this.companyType(), payload).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.created.emit();
                this.router.navigate(this.cancelRoute());
            },
            error: (error) => {
                this.isSubmitting.set(false);
                console.error('Error creating company:', error);
            }
        });
    }

    onCancel(): void {
        this.router.navigate(this.cancelRoute());
    }

    onPersonTypeSelected(): void {
        const personType = this.form.get('legalDocumentationDetails.personType')?.value as PersonType;
        this.documentTypes = getDocumentTypesByPersonType(personType);
    }
}
