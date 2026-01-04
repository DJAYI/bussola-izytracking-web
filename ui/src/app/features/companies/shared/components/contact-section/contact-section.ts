import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';

/**
 * Reusable component for displaying and editing contact information section.
 * Supports both view and edit modes with form fields.
 */
@Component({
    selector: 'app-contact-section',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Field],
    template: `
        <section class="bg-surface-light rounded-xl border border-gray-200 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h3 class="text-base font-semibold text-gray-800">Contacto</h3>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="contact-email" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Correo Electrónico</label>
                    @if (isEditing()) {
                        <input 
                            id="contact-email"
                            type="email"
                            [field]="emailField()!"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        />
                    } @else {
                        <div id="contact-email" class="flex items-center gap-2 text-sm text-gray-900">
                            {{ email() }}
                        </div>
                    }
                </div>
                <div>
                    <label for="contact-phone" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Número de Teléfono</label>
                    @if (isEditing()) {
                        <input 
                            id="contact-phone"
                            type="tel"
                            [field]="phoneField()!"
                            class="w-full text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        />
                    } @else {
                        <div id="contact-phone" class="flex items-center gap-2 text-sm text-gray-900">
                            {{ phoneNumber() }}
                        </div>
                    }
                </div>
            </div>
        </section>
    `
})
export class ContactSectionComponent {
    /** Whether the section is in edit mode */
    readonly isEditing = input(false);

    /** The email to display (view mode) */
    readonly email = input('');

    /** The phone number to display (view mode) */
    readonly phoneNumber = input('');

    /** Form field for email (edit mode) - should be editForm.email */
    readonly emailField = input<FieldTree<string, string>>();

    /** Form field for phone (edit mode) - should be editForm.phoneNumber */
    readonly phoneField = input<FieldTree<string, string>>();
}
