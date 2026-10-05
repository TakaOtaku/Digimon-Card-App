import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, switchMap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Functional HTTP interceptor that attaches a Firebase ID token
 * to outgoing requests targeting the application's API.
 *
 * - Only attaches tokens to requests aimed at our own backend (apiBaseUrl).
 * - Passes through silently when the user is not authenticated (public reads still work).
 * - If getIdToken() fails (expired session), the request proceeds without a token
 *   and the backend will return 401 for protected endpoints.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(Auth);

  // Only attach tokens for requests to our own API
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    return next(req);
  }

  return from(currentUser.getIdToken()).pipe(
    switchMap((token) => {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(cloned);
    }),
    catchError(() => {
      // Token refresh failed — proceed without auth header.
      // Backend will return 401 for protected endpoints.
      return next(req);
    }),
  );
};
