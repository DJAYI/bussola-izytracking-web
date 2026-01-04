import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from "@angular/core";
import { email, Field, form, minLength, required } from "@angular/forms/signals";
import { Router } from "@angular/router";
import { CompanyService } from "../../../features/companies/company.service";
import { CreateCompanyRequest } from "../../../auth/models/create-company.interface";
import { UserRole } from "../../../auth/models/role.enum";
import { DOCUMENT_TYPES, getDocumentTypesByPersonType } from "../../../shared/constants/document-types.constant";
import { PERSON_TYPES, PersonType } from "../../../shared/constants/person-types.constant";
import { City, Country, LocationService, State } from "../../../shared/services/location.service";

interface CompanyFormModel {
    displayName: string;
    email: string;
    password: string;
    legalDocumentationDetails: {
        documentNumber: string;
        documentType: string;
        personType: string;
    };
    addressDetails: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    contactInformation: {
        email: string;
        phoneNumber: string;
    };
}

const initialFormValue: CompanyFormModel = {
    displayName: '',
    email: '',
    password: '',
    legalDocumentationDetails: {
        documentNumber: '',
        documentType: '',
        personType: ''
    },
    addressDetails: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    },
    contactInformation: {
        email: '',
        phoneNumber: ''
    }
};

@Component({
    selector: "app-company-form",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Field],
    template: `
        <div class="max-w-7xl mx-auto border border-gray-200 bg-white rounded-xl shadow-sm p-8 space-y-8">
            <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-900">{{ title() }}</h3>
                <p class="text-gray-500 mt-1">{{ description() }}</p>
            </div>

            <form (submit)="onSubmit($event)" class="space-y-8">
                <!-- Información General -->
                <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
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
                                [field]="companyForm.displayName"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ej: Mi Empresa S.A.S"
                            />
                            @if (companyForm.displayName().touched() && companyForm.displayName().invalid()) {
                                <ul class="mt-1">
                                    @for (error of companyForm.displayName().errors(); track error) {
                                        <li class="text-sm text-red-600">{{ error.message }}</li>
                                    }
                                </ul>
                            }
                        </div>
                        <div>
                            <label for="email" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Correo Electrónico <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                [field]="companyForm.email"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="correo@empresa.com"
                            />
                            @if (companyForm.email().touched() && companyForm.email().invalid()) {
                                <ul class="mt-1">
                                    @for (error of companyForm.email().errors(); track error) {
                                        <li class="text-sm text-red-600">{{ error.message }}</li>
                                    }
                                </ul>
                            }
                        </div>
                        <div>
                            <label for="password" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Contraseña <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="password" 
                                id="password" 
                                [field]="companyForm.password"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Mínimo 8 caracteres"
                            />
                            @if (companyForm.password().touched() && companyForm.password().invalid()) {
                                <ul class="mt-1">
                                    @for (error of companyForm.password().errors(); track error) {
                                        <li class="text-sm text-red-600">{{ error.message }}</li>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                </section>

                <!-- Documentación Legal -->
                <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 class="text-base font-semibold text-gray-800">Documentación Legal</h4>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label for="personType" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Tipo de Persona <span class="text-red-500">*</span>
                            </label>
                            <select 
                                id="personType" 
                                [field]="companyForm.legalDocumentationDetails.personType"
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
                                [field]="companyForm.legalDocumentationDetails.documentType"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                                @if (!selectedPersonType()) {
                                    <option value="" disabled>Seleccione tipo de persona primero</option>
                                } @else {
                                    <option value="" disabled>Seleccione...</option>
                                    @for (type of documentTypes(); track type.value) {
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
                                [field]="companyForm.legalDocumentationDetails.documentNumber"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors font-mono"
                                placeholder="Ej: 900123456"
                            />
                        </div>
                    </div>
                </section>

                <!-- Dirección -->
                <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h4 class="text-base font-semibold text-gray-800">Dirección</h4>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label for="street" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Dirección <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="street" 
                                [field]="companyForm.addressDetails.street"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Calle 123 # 45-67"
                            />
                        </div>
                        <div>
                            <label for="country" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                País <span class="text-red-500">*</span>
                            </label>
                            <select 
                                id="country" 
                                [field]="companyForm.addressDetails.country"
                                [class.bg-gray-100]="loadingCountries()"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                                <option value="" disabled>{{ loadingCountries() ? 'Cargando países...' : 'Seleccione...' }}</option>
                                @for (country of countries(); track country.iso3) {
                                    <option [value]="country.iso3">{{ country.emoji }} {{ country.name }}</option>
                                }
                            </select>
                        </div>
                        <div>
                            <label for="state" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Departamento / Estado <span class="text-red-500">*</span>
                            </label>
                            <select 
                                id="state" 
                                [field]="companyForm.addressDetails.state"
                                [class.bg-gray-100]="loadingStates() || !states().length"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                                @if (loadingStates()) {
                                    <option value="" disabled>Cargando estados...</option>
                                } @else if (!states().length) {
                                    <option value="" disabled>Seleccione un país primero</option>
                                } @else {
                                    <option value="" disabled>Seleccione...</option>
                                    @for (state of states(); track state.iso2) {
                                        <option [value]="state.name">{{ state.name }}</option>
                                    }
                                }
                            </select>
                        </div>
                        <div>
                            <label for="city" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Ciudad <span class="text-red-500">*</span>
                            </label>
                            <select 
                                id="city" 
                                [field]="companyForm.addressDetails.city"
                                [class.bg-gray-100]="loadingCities() || !cities().length"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                            >
                                @if (loadingCities()) {
                                    <option value="" disabled>Cargando ciudades...</option>
                                } @else if (!cities().length) {
                                    <option value="" disabled>Seleccione un estado primero</option>
                                } @else {
                                    <option value="" disabled>Seleccione...</option>
                                    @for (city of cities(); track city.id) {
                                        <option [value]="city.name">{{ city.name }}</option>
                                    }
                                }
                            </select>
                        </div>
                        <div>
                            <label for="postalCode" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Código Postal <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="postalCode" 
                                [field]="companyForm.addressDetails.postalCode"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="Ej: 110111"
                            />
                        </div>
                    </div>
                </section>

                <!-- Información de Contacto -->
                <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <h4 class="text-base font-semibold text-gray-800">Información de Contacto</h4>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="contactEmail" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Correo de Contacto <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="contactEmail" 
                                [field]="companyForm.contactInformation.email"
                                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                placeholder="contacto@empresa.com"
                            />
                            @if (companyForm.contactInformation.email().touched() && companyForm.contactInformation.email().invalid()) {
                                <ul class="mt-1">
                                    @for (error of companyForm.contactInformation.email().errors(); track error) {
                                        <li class="text-sm text-red-600">{{ error.message }}</li>
                                    }
                                </ul>
                            }
                        </div>
                        <div>
                            <label for="phoneNumber" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">
                                Teléfono <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="tel" 
                                id="phoneNumber" 
                                [field]="companyForm.contactInformation.phoneNumber"
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
                        [disabled]="isSubmitting() || companyForm().invalid()"
                        class="px-6 py-2.5 text-white bg-red-700 hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        @if (isSubmitting()) {
                            <svg class="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
    private readonly companyService = inject(CompanyService);
    private readonly router = inject(Router);
    private readonly locationService = inject(LocationService);

    // Inputs
    readonly title = input.required<string>();
    readonly description = input.required<string>();
    readonly companyType = input.required<UserRole>();
    readonly submitButtonText = input('Crear Empresa');
    readonly cancelRoute = input.required<string[]>();

    // Outputs
    readonly created = output<void>();

    // State
    protected readonly isSubmitting = signal(false);
    protected readonly countries = signal<Country[]>([]);
    protected readonly states = signal<State[]>([]);
    protected readonly cities = signal<City[]>([]);
    protected readonly loadingCountries = signal(false);
    protected readonly loadingStates = signal(false);
    protected readonly loadingCities = signal(false);

    // Track selected ISO2 codes for cascading (reactive)
    private readonly selectedCountryIso2 = signal('');
    private readonly selectedStateIso2 = signal('');

    // Constants
    readonly personTypes = PERSON_TYPES;

    // Signal Form
    private readonly formModel = signal<CompanyFormModel>(initialFormValue);

    readonly companyForm = form(this.formModel, (schema) => {
        required(schema.displayName, { message: 'El nombre es requerido' });
        minLength(schema.displayName, 3, { message: 'Mínimo 3 caracteres' });

        required(schema.email, { message: 'El correo es requerido' });
        email(schema.email, { message: 'Ingrese un correo válido' });

        required(schema.password, { message: 'La contraseña es requerida' });
        minLength(schema.password, 8, { message: 'Mínimo 8 caracteres' });

        required(schema.legalDocumentationDetails.documentNumber, { message: 'El número de documento es requerido' });
        required(schema.legalDocumentationDetails.documentType, { message: 'El tipo de documento es requerido' });
        required(schema.legalDocumentationDetails.personType, { message: 'El tipo de persona es requerido' });

        required(schema.addressDetails.street, { message: 'La dirección es requerida' });
        required(schema.addressDetails.city, { message: 'La ciudad es requerida' });
        required(schema.addressDetails.state, { message: 'El estado es requerido' });
        required(schema.addressDetails.postalCode, { message: 'El código postal es requerido' });
        required(schema.addressDetails.country, { message: 'El país es requerido' });

        required(schema.contactInformation.email, { message: 'El correo de contacto es requerido' });
        email(schema.contactInformation.email, { message: 'Ingrese un correo válido' });
        required(schema.contactInformation.phoneNumber, { message: 'El teléfono es requerido' });
    });

    // Computed for cascading document types
    readonly selectedPersonType = computed(() => this.companyForm.legalDocumentationDetails.personType().value() as PersonType);
    readonly documentTypes = computed(() => {
        const personType = this.selectedPersonType();
        return personType ? getDocumentTypesByPersonType(personType) : DOCUMENT_TYPES;
    });

    constructor() {
        // Load countries on init
        this.loadCountries();

        // Effect for country change
        effect(() => {
            const countryIso3 = this.companyForm.addressDetails.country().value();
            if (!countryIso3) return;

            const country = this.countries().find(c => c.iso3 === countryIso3);
            if (!country || country.iso2 === this.selectedCountryIso2()) return;

            this.selectedCountryIso2.set(country.iso2);
            this.formModel.update(model => ({
                ...model,
                addressDetails: { ...model.addressDetails, state: '', city: '' }
            }));
            this.states.set([]);
            this.cities.set([]);
            this.loadStates(country.iso2);
        });

        // Effect for state change
        effect(() => {
            const stateName = this.companyForm.addressDetails.state().value();
            if (!stateName) return;

            const state = this.states().find(s => s.name === stateName);
            if (!state || state.iso2 === this.selectedStateIso2()) return;

            this.selectedStateIso2.set(state.iso2);
            this.formModel.update(model => ({
                ...model,
                addressDetails: { ...model.addressDetails, city: '' }
            }));
            this.cities.set([]);
            this.loadCities(this.selectedCountryIso2(), state.iso2);
        });

        // Effect for person type change - reset document type
        effect(() => {
            const personType = this.selectedPersonType();
            if (personType) {
                this.formModel.update(model => ({
                    ...model,
                    legalDocumentationDetails: { ...model.legalDocumentationDetails, documentType: '' }
                }));
            }
        });
    }

    private loadCountries(): void {
        this.loadingCountries.set(true);
        this.locationService.getCountries().subscribe({
            next: (data) => {
                this.countries.set(data);
                this.loadingCountries.set(false);
            },
            error: () => this.loadingCountries.set(false)
        });
    }

    private loadStates(countryIso2: string): void {
        this.loadingStates.set(true);
        this.locationService.getStates(countryIso2).subscribe({
            next: (data) => {
                this.states.set(data);
                this.loadingStates.set(false);
            },
            error: () => this.loadingStates.set(false)
        });
    }

    private loadCities(countryIso2: string, stateIso2: string): void {
        this.loadingCities.set(true);
        this.locationService.getCities(countryIso2, stateIso2).subscribe({
            next: (data) => {
                this.cities.set(data);
                this.loadingCities.set(false);
            },
            error: () => this.loadingCities.set(false)
        });
    }

    protected onSubmit(event: Event): void {
        event.preventDefault();

        if (this.companyForm().invalid()) return;

        this.isSubmitting.set(true);
        const payload = this.formModel() as CreateCompanyRequest;

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

    protected onCancel(): void {
        this.router.navigate(this.cancelRoute());
    }
}
