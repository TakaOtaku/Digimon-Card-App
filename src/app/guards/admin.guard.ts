import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services';
import { ADMINS } from '@models';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(
    map(() => {
      const uid = authService.currentUser()?.uid;
      const isAdmin = !!uid && ADMINS.some((a) => a.admin && a.id === uid);
      return isAdmin ? true : router.createUrlTree(['/']);
    }),
  );
};
