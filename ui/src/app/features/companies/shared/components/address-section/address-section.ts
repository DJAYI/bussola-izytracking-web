import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Field } from '@angular/forms/signals';

/**
 * Reusable component for displaying and editing address information section.
 * Supports both view and edit modes with form fields.
 */
@Component({
    selector: 'app-address-section',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Field],
    template: `
        <section class="bg-surface-light rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
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
                            [field]="streetField()"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            aria-label="Calle / Dirección"
                        />
                    } @else {
                        <p class="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">{{ street() }}</p>
                    }
                </div>
                <div>
                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Ciudad</label>
                    @if (isEditing()) {
                        <input 
                            type="text"
                            [field]="cityField()"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            aria-label="Ciudad"
                        />
                    } @else {
                        <p class="text-sm text-gray-700">{{ city() }}</p>
                    }
                </div>
                <div>
                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Estado / Departamento</label>
                    @if (isEditing()) {
                        <input 
                            type="text"
                            [field]="stateField()"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            aria-label="Estado / Departamento"
                        />
                    } @else {
                        <p class="text-sm text-gray-700">{{ state() }}</p>
                    }
                </div>
                <div>
                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Código Postal</label>
                    @if (isEditing()) {
                        <input 
                            type="text"
                            [field]="postalCodeField()"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            aria-label="Código Postal"
                        />
                    } @else {
                        <p class="text-sm text-gray-700">{{ postalCode() }}</p>
                    }
                </div>
                <div>
                    <label class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">País</label>
                    @if (isEditing()) {
                        <input 
                            type="text"
                            [field]="countryField()"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            aria-label="País"
                        />
                    } @else {
                        <p class="text-sm text-gray-700 flex items-center gap-2">{{ country() }}</p>
                    }
                </div>
            </div>
        </section>
    `
})
export class AddressSectionComponent {
    /** Whether the section is in edit mode */
    readonly isEditing = input(false);

    // View mode values
    readonly street = input('');
    readonly city = input('');
    readonly state = input('');
    readonly postalCode = input('');
    readonly country = input('');

    // Edit mode form fields
    readonly streetField = input.required<any>();
    readonly cityField = input.required<any>();
    readonly stateField = input.required<any>();
    readonly postalCodeField = input.required<any>();
    readonly countryField = input.required<any>();
}
