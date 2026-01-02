export interface LegalDocumentation {
    documentNumber: string;
    documentType: 'NIT' | 'CC' | 'CE' | 'RUT';
    personType: 'NATURAL' | 'JURIDICAL';
}

export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Contact {
    email: string;
    phoneNumber: string;
    mobileNumber: string | null;
}

export interface UserCompany {
    id: string;
    userId: string;
    legalDocumentation: LegalDocumentation;
    address: Address;
    contact: Contact;
}
