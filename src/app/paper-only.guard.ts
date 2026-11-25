import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SaveStore } from './store/save.store';

/** Collection, rulings and products belong to the paper game only. */
export const paperOnlyGuard: CanActivateFn = () => (inject(SaveStore).alysionMode() ? inject(Router).createUrlTree(['/cards']) : true);
