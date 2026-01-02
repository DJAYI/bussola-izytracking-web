export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    email: string;
    displayName: string;
    role: 'ADMIN' | 'AGENCY' | 'TRANSPORT_PROVIDER';
    accessToken: string;
}