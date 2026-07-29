import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

function runGuard(isLoggedIn: boolean) {
  const authService = { authReady$: of(true), isLoggedIn } as unknown as AuthService;
  const urlTree = { redirect: true };
  const router = { createUrlTree: jest.fn().mockReturnValue(urlTree) };

  TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useValue: authService },
      { provide: Router, useValue: router },
    ],
  });

  const result$ = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
  return { result$, router, urlTree };
}

describe('authGuard', () => {
  it('allows navigation when the user is logged in', (done) => {
    const { result$ } = runGuard(true);
    (result$ as any).subscribe((value: unknown) => {
      expect(value).toBe(true);
      done();
    });
  });

  it('redirects to home when logged out', (done) => {
    const { result$, router, urlTree } = runGuard(false);
    (result$ as any).subscribe((value: unknown) => {
      expect(value).toBe(urlTree);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
      done();
    });
  });
});
