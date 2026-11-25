import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlysionModeService } from '../../../services/alysion-mode.service';

@Component({
  selector: 'digimon-alysion-switch',
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-pressed]="mode() === 'alysion'"
      [class]="mode() === 'alysion' ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-ink-2 text-fg hover:border-accent'"
      title="Switch the site to DIGIMON ALYSION cards and decks"
      class="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-semibold">
      <i [class]="'pi ' + (mode() === 'alysion' ? 'pi-check' : 'pi-mobile')" aria-hidden="true"></i>
      Alysion
    </button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlysionSwitchComponent {
  private alysionMode = inject(AlysionModeService);
  mode = this.alysionMode.mode;

  toggle(): void {
    this.alysionMode.setMode(this.mode() === 'alysion' ? 'paper' : 'alysion');
  }
}
