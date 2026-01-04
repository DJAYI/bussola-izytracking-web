import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../auth,service';
import { UserRole } from '../models/role.enum';

/**
 * Guard that checks if the user has the required role(s) to access a route.
 * 
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns CanActivateFn that checks user role against allowed roles
 * 
 * @example
 * // In routes configuration:
 * {
 *   path: 'agencies',
 *   canActivate: [roleGuard([UserRole.ADMIN])],
 *   component: AgenciesComponent
 * }
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        return authService.getCurrentSession().pipe(
            map(response => {
                const userRole = response.data.role;

                if (allowedRoles.includes(userRole)) {
                    return true;
                }

                if (UserRole.ADMIN === userRole) {
                    router.navigate(['/admin', 'agencies']);
                    return false;
                }

                // Redirect to appropriate page based on role
                console.warn(`Access denied. User role "${userRole}" is not in allowed roles: [${allowedRoles.join(', ')}]`);
                router.navigate(['/admin']);
                return false;
            }),
            catchError(() => {
                // If session check fails, redirect to login
                router.navigate(['/auth/login']);
                return of(false);
            })
        );
    };
}

/**
 * Guard that checks if the user has the required role(s) before loading a route module.
 * Use this for lazy-loaded routes to prevent module loading for unauthorized users.
 * 
 * @param allowedRoles - Array of roles that are allowed to load the route
 * @returns CanMatchFn that checks user role against allowed roles
 * 
 * @example
 * // In routes configuration with lazy loading:
 * {
 *   path: 'agencies',
 *   canMatch: [roleMatchGuard([UserRole.ADMIN])],
 *   loadChildren: () => import('./agencies/agencies.routes')
 * }
 */
export function roleMatchGuard(allowedRoles: UserRole[]): CanMatchFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        return authService.getCurrentSession().pipe(
            map(response => {
                const userRole = response.data.role;

                if (allowedRoles.includes(userRole)) {
                    return true;
                }

                console.warn(`Route match denied. User role "${userRole}" is not in allowed roles: [${allowedRoles.join(', ')}]`);
                router.navigate(['/admin']);
                return false;
            }),
            catchError(() => {
                router.navigate(['/auth/login']);
                return of(false);
            })
        );
    };
}
