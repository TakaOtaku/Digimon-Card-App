import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DeckFormat } from '@models';
import { AlysionModeService } from '../../../services/alysion-mode.service';
import { AlysionSwitchComponent } from './alysion-switch.component';

describe('AlysionSwitchComponent', () => {
  it('switches between paper and Alysion and shows which is on', () => {
    const mode = signal<DeckFormat>('paper');
    const setMode = jest.fn((format: DeckFormat) => mode.set(format));
    TestBed.configureTestingModule({ providers: [{ provide: AlysionModeService, useValue: { mode, setMode } }] });
    const fixture = TestBed.createComponent(AlysionSwitchComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.click();
    fixture.detectChanges();
    expect(setMode).toHaveBeenLastCalledWith('alysion');
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    expect(setMode).toHaveBeenLastCalledWith('paper');
  });
});
