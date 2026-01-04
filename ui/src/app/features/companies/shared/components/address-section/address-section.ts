import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { City, Country, LocationService, State } from '../../../../../shared/services/location.service';

/**
 * Reusable component for displaying and editing address information section.
 * Supports both view and edit modes with form fields.
 * In edit mode, uses the Location API for cascading country/state/city selects.
 */
@Component({
    selector: 'app-address-section',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Field],
    template: `
        <section class="bg-surface-light rounded-xl border border-gray-200 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 class="text-base font-semibold text-gray-800">Dirección</h3>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <label for="address-street" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Calle / Dirección</label>
                    @if (isEditing()) {
                        <input 
                            id="address-street"
                            type="text"
                            [field]="streetField()!"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        />
                    } @else {
                        <p id="address-street" class="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">{{ street() }}</p>
                    }
                </div>
                <div>
                    <label for="address-country" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">País</label>
                    @if (isEditing()) {
                        <select 
                            id="address-country"
                            [field]="countryField()!"
                            [class.bg-gray-100]="loadingCountries()"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        >
                            <option value="" disabled>{{ loadingCountries() ? 'Cargando países...' : 'Seleccione...' }}</option>
                            @for (c of countries(); track c.iso3) {
                                <option [value]="c.iso3">{{ c.emoji }} {{ c.name }}</option>
                            }
                        </select>
                    } @else {
                        <p id="address-country" class="text-sm text-gray-700 flex items-center gap-2">{{ countryDisplay() }}</p>
                    }
                </div>
                <div>
                    <label for="address-state" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Estado / Departamento</label>
                    @if (isEditing()) {
                        <select 
                            id="address-state"
                            [field]="stateField()!"
                            [class.bg-gray-100]="loadingStates() || !states().length"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        >
                            @if (loadingStates()) {
                                <option value="" disabled>Cargando estados...</option>
                            } @else if (!states().length) {
                                <option value="" disabled>Seleccione un país primero</option>
                            } @else {
                                <option value="" disabled>Seleccione...</option>
                                @for (s of states(); track s.iso2) {
                                    <option [value]="s.name">{{ s.name }}</option>
                                }
                            }
                        </select>
                    } @else {
                        <p id="address-state" class="text-sm text-gray-700">{{ state() }}</p>
                    }
                </div>
                <div>
                    <label for="address-city" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Ciudad</label>
                    @if (isEditing()) {
                        <select 
                            id="address-city"
                            [field]="cityField()!"
                            [class.bg-gray-100]="loadingCities() || !cities().length"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        >
                            @if (loadingCities()) {
                                <option value="" disabled>Cargando ciudades...</option>
                            } @else if (!cities().length) {
                                <option value="" disabled>Seleccione un estado primero</option>
                            } @else {
                                <option value="" disabled>Seleccione...</option>
                                @for (c of cities(); track c.id) {
                                    <option [value]="c.name">{{ c.name }}</option>
                                }
                            }
                        </select>
                    } @else {
                        <p id="address-city" class="text-sm text-gray-700">{{ city() }}</p>
                    }
                </div>
                <div>
                    <label for="address-postal-code" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Código Postal</label>
                    @if (isEditing()) {
                        <input 
                            id="address-postal-code"
                            type="text"
                            [field]="postalCodeField()!"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        />
                    } @else {
                        <p id="address-postal-code" class="text-sm text-gray-700">{{ postalCode() }}</p>
                    }
                </div>
            </div>
        </section>
    `
})
export class AddressSectionComponent {
    private readonly locationService = inject(LocationService);

    /** Whether the section is in edit mode */
    readonly isEditing = input(false);

    // View mode values
    readonly street = input('');
    readonly city = input('');
    readonly state = input('');
    readonly postalCode = input('');
    readonly country = input('');

    // Edit mode form fields
    readonly streetField = input<FieldTree<string, string>>();
    readonly cityField = input<FieldTree<string, string>>();
    readonly stateField = input<FieldTree<string, string>>();
    readonly postalCodeField = input<FieldTree<string, string>>();
    readonly countryField = input<FieldTree<string, string>>();

    // Output to notify parent when location values change (for cascading updates)
    readonly stateReset = output<void>();
    readonly cityReset = output<void>();

    // Location data
    protected readonly countries = signal<Country[]>([]);
    protected readonly states = signal<State[]>([]);
    protected readonly cities = signal<City[]>([]);
    protected readonly loadingCountries = signal(false);
    protected readonly loadingStates = signal(false);
    protected readonly loadingCities = signal(false);

    // Track ISO2 codes for API calls using signals (reactive)
    private readonly selectedCountryIso2 = signal('');
    private readonly selectedStateIso2 = signal('');

    // Display country with emoji in view mode
    protected readonly countryDisplay = computed(() => {
        const countryValue = this.country();
        const countryData = this.countries().find(c => c.iso3 === countryValue || c.name === countryValue);
        return countryData ? `${countryData.emoji} ${countryData.name}` : countryValue;
    });

    constructor() {
        // Effect to load countries when editing mode is enabled
        effect(() => {
            if (this.isEditing() && !this.countries().length && !this.loadingCountries()) {
                this.loadCountries();
            }
        });

        // Effect to load states when country changes
        effect(() => {
            const countryField = this.countryField();
            if (!countryField || !this.isEditing()) return;

            const countryIso3 = countryField().value();
            if (!countryIso3) return;

            const country = this.countries().find(c => c.iso3 === countryIso3);
            if (!country || country.iso2 === this.selectedCountryIso2()) return;

            this.selectedCountryIso2.set(country.iso2);
            this.states.set([]);
            this.cities.set([]);
            this.stateReset.emit();
            this.loadStates(country.iso2);
        });

        // Effect to load cities when state changes
        effect(() => {
            const stateField = this.stateField();
            if (!stateField || !this.isEditing()) return;

            const stateName = stateField().value();
            if (!stateName) return;

            const state = this.states().find(s => s.name === stateName);
            if (!state || state.iso2 === this.selectedStateIso2()) return;

            this.selectedStateIso2.set(state.iso2);
            this.cities.set([]);
            this.cityReset.emit();
            this.loadCities(this.selectedCountryIso2(), state.iso2);
        });
    }

    private loadCountries(): void {
        this.loadingCountries.set(true);
        this.locationService.getCountries().subscribe({
            next: (data) => {
                this.countries.set(data);
                this.loadingCountries.set(false);
                this.initializeExistingLocation();
            },
            error: () => this.loadingCountries.set(false)
        });
    }

    private initializeExistingLocation(): void {
        const countryField = this.countryField();
        if (!countryField) return;

        const countryIso3 = countryField().value();
        if (!countryIso3) return;

        const country = this.countries().find(c => c.iso3 === countryIso3);
        if (country) {
            this.selectedCountryIso2.set(country.iso2);
            this.loadStates(country.iso2);
        }
    }

    private loadStates(countryIso2: string): void {
        this.loadingStates.set(true);
        this.locationService.getStates(countryIso2).subscribe({
            next: (data) => {
                this.states.set(data);
                this.loadingStates.set(false);
                this.initializeExistingState();
            },
            error: () => this.loadingStates.set(false)
        });
    }

    private initializeExistingState(): void {
        const stateField = this.stateField();
        if (!stateField) return;

        const stateName = stateField().value();
        if (!stateName) return;

        const state = this.states().find(s => s.name === stateName);
        if (state) {
            this.selectedStateIso2.set(state.iso2);
            this.loadCities(this.selectedCountryIso2(), state.iso2);
        }
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
}
