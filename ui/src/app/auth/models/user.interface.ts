import { UserRole } from './role.enum';
import { UserStatus } from './user-status.enum';

export interface User {
    id: string;
    displayName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}