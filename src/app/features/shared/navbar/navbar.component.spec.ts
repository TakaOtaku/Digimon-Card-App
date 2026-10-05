import { environment } from '../../../../environments/environment';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  it('exposes the configured app URL for the logo link', () => {
    const component = new NavbarComponent();
    expect((component as any).appUrl).toBe(environment.appUrl);
  });
});
