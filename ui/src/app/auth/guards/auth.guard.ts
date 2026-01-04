import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../auth,service';

/**
 * Guard that checks if the user is authenticated.
 * Redirects to login page if not authenticated.
 * 
 * @example
 * // In routes configuration:
 * {
 *   path: 'admin',
 *   canActivate: [authGuard],
 *   component: DashboardLayout
 * }
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Validate the session with the server
    return authService.getCurrentSession().pipe(
        map(response => {
            if (response.data) {
                authService.currentUser = response.data;
                return true;
            }
            router.navigate(['/auth/login']);
            return false;
        }),
        catchError(() => {
            router.navigate(['/auth/login']);
            return of(false);
        })
    );
};

/**
 * Guard that prevents authenticated users from accessing public routes (like login).
 * Redirects to dashboard if already authenticated.
 * 
 * @example
 * // In routes configuration:
 * {
 *   path: 'login',
 *   canActivate: [publicGuard],
 *   component: LoginPage
 * }
 */
export const publicGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.getCurrentSession().pipe(
        map(response => {
            if (response.data) {
                // User is authenticated, redirect to dashboard
                router.navigate(['/admin']);
                return false;
            }
            return true;
        }),
        catchError(() => {
            // Token is invalid, allow access to public route
            return of(true);
        })
    );
};
