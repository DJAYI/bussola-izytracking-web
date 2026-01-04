import { PersonType } from './person-types.constant';

/**
 * Legal document types available in the system.
 */
export const DocumentType = {
    NIT: 'NIT',
    CC: 'CC',
    CE: 'CE',
    RUT: 'RUT',
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

/**
 * Document type labels for display purposes.
 */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
    [DocumentType.NIT]: 'NIT',
    [DocumentType.CC]: 'Cédula de Ciudadanía',
    [DocumentType.CE]: 'Cédula de Extranjería',
    [DocumentType.RUT]: 'RUT',
} as const;

/**
 * Gets the label for a document type. Returns empty string for invalid types.
 */
export function getDocumentTypeLabel(documentType: string | undefined | null): string {
    if (!documentType || !(documentType in DOCUMENT_TYPE_LABELS)) {
        return '';
    }
    return DOCUMENT_TYPE_LABELS[documentType as DocumentType];
}

/**
 * Document types with their associated person type.
 */
export interface DocumentTypeOption {
    value: DocumentType;
    label: string;
    personType: PersonType;
}

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
    { value: DocumentType.NIT, label: DOCUMENT_TYPE_LABELS[DocumentType.NIT], personType: 'JURIDICAL' },
    { value: DocumentType.CC, label: DOCUMENT_TYPE_LABELS[DocumentType.CC], personType: 'NATURAL' },
    { value: DocumentType.CE, label: DOCUMENT_TYPE_LABELS[DocumentType.CE], personType: 'NATURAL' },
    { value: DocumentType.RUT, label: DOCUMENT_TYPE_LABELS[DocumentType.RUT], personType: 'JURIDICAL' },
];

/**
 * Gets document types filtered by person type.
 */
export function getDocumentTypesByPersonType(personType: PersonType): DocumentTypeOption[] {
    return DOCUMENT_TYPES.filter(dt => dt.personType === personType);
}
