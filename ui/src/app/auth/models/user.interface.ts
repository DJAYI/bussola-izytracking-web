export interface User {
    id: string;
    displayName: string;
    email: string;
    role: 'ADMIN' | 'AGENCY' | 'TRANSPORT_PROVIDER';
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING_ACTIVATION';
}