import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../auth,service';
import { UserRole } from '../models/role.enum';

/**
 * Guard that checks if the user has the required role(s) to access a route.
 * 
 * Note: The session interceptor handles token refresh automatically.
 * If refresh fails after retries, the interceptor will logout.
 * 
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns CanActivateFn that checks user role against allowed roles
 * 
 * @example
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

                // User doesn't have required role - redirect to their default route
                console.warn(`Access denied. User role "${userRole}" is not in allowed roles: [${allowedRoles.join(', ')}]`);

                if (userRole === UserRole.ADMIN) {
                    router.navigate(['/admin', 'agencies']);
                } else {
                    router.navigate(['/admin', 'services']);
                }
                return false;
            }),
            catchError(() => {
                // Interceptor already handled logout after failed refresh retries
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
 * Note: The session interceptor handles token refresh automatically.
 * 
 * @param allowedRoles - Array of roles that are allowed to load the route
 * @returns CanMatchFn that checks user role against allowed roles
 * 
 * @example
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

                if (userRole === UserRole.ADMIN) {
                    router.navigate(['/admin', 'agencies']);
                } else {
                    router.navigate(['/admin', 'services']);
                }
                return false;
            }),
            catchError(() => {
                // Interceptor already handled logout after failed refresh retries
                router.navigate(['/auth/login']);
                return of(false);
            })
        );
    };
}
