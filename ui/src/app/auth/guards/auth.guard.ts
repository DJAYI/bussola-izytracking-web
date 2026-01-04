import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../auth,service';

/**
 * Guard that checks if the user is authenticated.
 * Redirects to login page if not authenticated.
 * 
 * Note: The session interceptor handles token refresh automatically.
 * If refresh fails after retries, the interceptor will logout and this
 * guard will receive an error, redirecting to login.
 * 
 * @example
 * {
 *   path: 'admin',
 *   canActivate: [authGuard],
 *   component: DashboardLayout
 * }
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.getCurrentSession().pipe(
        map(response => !!response.data),
        catchError(() => {
            // Interceptor already handled logout after failed refresh retries
            router.navigate(['/auth/login']);
            return of(false);
        })
    );
};

/**
 * Guard that prevents authenticated users from accessing public routes (like login).
 * Redirects to appropriate dashboard based on user role.
 * 
 * @example
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
                // User is authenticated, redirect based on role
                const role = response.data.role;
                if (role === 'ADMIN') {
                    router.navigate(['/admin', 'agencies']);
                } else {
                    router.navigate(['/admin', 'services']);
                }
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
