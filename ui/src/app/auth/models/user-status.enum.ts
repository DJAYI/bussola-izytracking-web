/**
 * User account status in the system.
 */
export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING_ACTIVATION: 'PENDING_ACTIVATION',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];
