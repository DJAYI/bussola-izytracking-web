import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Reusable component for displaying legal documentation section.
 * Displays person type, document type, and document number (read-only).
 */
@Component({
    selector: 'app-legal-docs-section',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <section class="bg-surface-light rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-base font-semibold text-gray-800">Documentación Legal</h3>
                @if (showReadOnlyBadge()) {
                    <span class="ml-auto text-xs text-gray-400">(Solo lectura)</span>
                }
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="legal-person-type" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Tipo de Persona</label>
                    <div id="legal-person-type" class="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">{{ personTypeLabel() }}</div>
                </div>
                <div>
                    <label for="legal-document-type" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Tipo de Documento</label>
                    <div id="legal-document-type" class="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">{{ documentTypeLabel() }}</div>
                </div>
                <div class="md:col-span-2">
                    <label for="legal-document-number" class="block text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Número de Documento</label>
                    <div id="legal-document-number" class="flex items-center justify-between text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                        <span class="mt-1 font-sans font-semibold">{{ documentNumber() }}</span>
                        <button
                            (click)="onCopyClick()"
                            type="button" 
                            class="text-gray-400 text-sm cursor-pointer p-2 border bg-gray-200 border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                            aria-label="Copiar número de documento">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class LegalDocsSectionComponent {
    /** Label for the person type (e.g., "Persona Natural", "Persona Jurídica") */
    readonly personTypeLabel = input.required<string>();

    /** Label for the document type (e.g., "Cédula de Ciudadanía", "NIT") */
    readonly documentTypeLabel = input.required<string>();

    /** The document number to display */
    readonly documentNumber = input.required<string>();

    /** Whether to show the "(Solo lectura)" badge */
    readonly showReadOnlyBadge = input(false);

    /** Emits when the copy button is clicked */
    readonly copyRequested = output<string>();

    protected onCopyClick(): void {
        this.copyRequested.emit(this.documentNumber());
    }
}
