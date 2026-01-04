import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth,service';

let isRefreshing = false;
const refresh$ = new BehaviorSubject<boolean>(false);
const AUTH_URLS = ['/auth/login', '/auth/logout', '/auth/refresh', '/auth/register', '/auth/me'];

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
        switchMap(() => {
          isRefreshing = false;
          refresh$.next(true);
          return next(req.clone({ withCredentials: true }));
        }),
        catchError(err => {
          isRefreshing = false;
          refresh$.next(false);
          authService.logout();
          return throwError(() => err);
        })
      );
    })
  );
};
