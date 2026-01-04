/**
 * Shared form model for editing company contact and address information.
 * Used by profile, modify-client, and modify-transport-provider components.
 */
export interface CompanyEditFormModel {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    phoneNumber: string;
}

/**
 * Creates an empty CompanyEditFormModel with default empty strings.
 */
export function createEmptyCompanyEditFormModel(): CompanyEditFormModel {
    return {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        email: '',
        phoneNumber: ''
    };
}
