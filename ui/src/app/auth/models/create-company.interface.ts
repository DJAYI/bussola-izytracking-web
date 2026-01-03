export interface CreateCompanyRequest {
    displayName: string;
    email: string;
    password: string;
    legalDocumentationDetails: {
        documentNumber: string;
        documentType: 'NIT' | 'CC' | 'CE' | 'RUT';
        personType: 'NATURAL' | 'JURIDICAL';
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
