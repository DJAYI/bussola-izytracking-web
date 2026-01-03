import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth,service';

const AUTH_SKIP_URLS = ['/auth/login', '/auth/refresh', '/auth/logout', '/auth/register'];

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const shouldSkipRefresh = AUTH_SKIP_URLS.some((url) => req.url.includes(url));

      if (error.status === 401 && !shouldSkipRefresh) {
        return authService.refresh().pipe(
          switchMap(() => {
            const retryReq = req.clone({
              withCredentials: true,
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Si es 401 en login/refresh/logout, redirigir al login
      if (error.status === 401 && shouldSkipRefresh && !req.url.includes('/auth/login')) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
