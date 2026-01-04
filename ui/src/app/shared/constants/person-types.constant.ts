/**
 * Person types for legal documentation.
 */
export const PersonType = {
    NATURAL: 'NATURAL',
    JURIDICAL: 'JURIDICAL',
} as const;

export type PersonType = typeof PersonType[keyof typeof PersonType];

/**
 * Person type labels for display purposes.
 */
export const PERSON_TYPE_LABELS: Record<PersonType, string> = {
    [PersonType.NATURAL]: 'Persona Natural',
    [PersonType.JURIDICAL]: 'Persona Jurídica',
} as const;

/**
 * Gets the label for a person type. Returns empty string for invalid types.
 */
export function getPersonTypeLabel(personType: string | undefined | null): string {
    if (!personType || !(personType in PERSON_TYPE_LABELS)) {
        return '';
    }
    return PERSON_TYPE_LABELS[personType as PersonType];
}

/**
 * Person type options for select dropdowns.
 */
export interface PersonTypeOption {
    value: PersonType;
    label: string;
}

export const PERSON_TYPES: PersonTypeOption[] = [
    { value: PersonType.NATURAL, label: PERSON_TYPE_LABELS[PersonType.NATURAL] },
    { value: PersonType.JURIDICAL, label: PERSON_TYPE_LABELS[PersonType.JURIDICAL] },
];
