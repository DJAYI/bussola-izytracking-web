import { UserRole } from './role.enum';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    email: string;
    displayName: string;
    role: UserRole;
    accessToken: string;
}