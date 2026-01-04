/**
 * User roles in the system.
 * Determines access levels and available features.
 */
export const UserRole = {
    ADMIN: 'ADMIN',
    AGENCY: 'AGENCY',
    TRANSPORT_PROVIDER: 'TRANSPORT_PROVIDER',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * Maps user roles to their corresponding API endpoints.
 */
export const ROLE_ENDPOINT_MAP: Record<string, string> = {
    [UserRole.AGENCY]: 'agencies',
    [UserRole.TRANSPORT_PROVIDER]: 'transport-providers',
} as const;

/**
 * Gets the API endpoint for a given role or company type.
 */
export function getEndpointForRole(role: string): string {
    return ROLE_ENDPOINT_MAP[role] ?? 'agencies';
}
