import { MigrationComponent } from './migration.component';

describe('MigrationComponent (token plumbing)', () => {
  it('proxies the migration token to the migration service', () => {
    const migrationService: any = { migrationToken: '' };
    const cdr: any = { detectChanges: jest.fn() };
    const component = new MigrationComponent(migrationService, cdr);

    component.migrationToken = 'super-secret';

    expect(migrationService.migrationToken).toBe('super-secret');
    expect(component.migrationToken).toBe('super-secret');
  });
});
