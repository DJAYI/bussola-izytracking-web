import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, retry, switchMap, take, throwError, timer } from 'rxjs';
import { AuthService } from '../auth,service';

const MAX_REFRESH_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

let isRefreshing = false;
const refresh$ = new BehaviorSubject<boolean>(false);

// URLs que NO deben pasar por el interceptor de refresh (evitar loops)
const AUTH_URLS = ['/auth/login', '/auth/logout', '/auth/refresh', '/auth/register'];

/** Determina si un error es recuperable (vale la pena reintentar) */
const isRetryableError = (error: HttpErrorResponse): boolean => {
  // Solo reintentar en errores de red o servidor (5xx), no en errores de autenticación (4xx)
  return error.status === 0 || error.status >= 500;
};

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authReq = req.clone({ withCredentials: true });

  if (AUTH_URLS.some(url => req.url.includes(url))) {
    return next(authReq);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);

      if (isRefreshing) {
        return refresh$.pipe(
          filter(Boolean),
          take(1),
          switchMap(() => next(req.clone({ withCredentials: true })))
        );
      }

      isRefreshing = true;
      refresh$.next(false);

      return authService.refresh().pipe(
        retry({
          count: MAX_REFRESH_RETRIES,
          delay: (err, retryCount) => {
            // Solo reintentar en errores de red/servidor, no en errores de auth
            if (!isRetryableError(err)) {
              throw err; // No reintentar, propagar el error inmediatamente
            }
            console.warn(`Refresh attempt ${retryCount}/${MAX_REFRESH_RETRIES} failed (network error), retrying...`);
            return timer(RETRY_DELAY_MS);
          }
        }),
        switchMap(() => {
          isRefreshing = false;
          refresh$.next(true);
          return next(req.clone({ withCredentials: true }));
        }),
        catchError(err => {
          isRefreshing = false;
          refresh$.next(false);
          // Solo limpiar sesión, el guard se encargará de redirigir
          authService.clearSession().subscribe();
          return throwError(() => err);
        })
      );
    })
  );
};
