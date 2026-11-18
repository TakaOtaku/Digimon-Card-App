import { TestBed } from '@angular/core/testing';
import { dummyCard } from '@models';
import { DialogStore } from '@store';
import { CardDetailPanelComponent } from './card-detail-panel.component';

describe('CardDetailPanelComponent', () => {
  it('links directly to the selected card wiki page', () => {
    TestBed.configureTestingModule({
      imports: [CardDetailPanelComponent],
      providers: [{ provide: DialogStore, useValue: { updateViewCardDialog: jest.fn() } }],
    });
    const fixture = TestBed.createComponent(CardDetailPanelComponent);
    fixture.componentRef.setInput('card', { ...dummyCard, id: 'ST01-001_P1', cardNumber: 'ST01-001' });
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[aria-label="View card on wiki"]');
    expect(link.href).toBe('https://digimoncardgame.fandom.com/wiki/ST1-001');
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });

  it('places option requirements before the option effect and dual effect and Link DP after it', () => {
    TestBed.configureTestingModule({
      imports: [CardDetailPanelComponent],
      providers: [{ provide: DialogStore, useValue: { updateViewCardDialog: jest.fn() } }],
    });
    const fixture = TestBed.createComponent(CardDetailPanelComponent);
    fixture.componentRef.setInput('card', {
      ...dummyCard,
      optionCardColourRequirement: 'Red',
      optionCardEffect: '[Main] Use it.',
      dualEffect: '[Arts Digivolve] Cost 3',
      linkEffect: '[When Linking] Draw 1.',
      linkDP: '+2000',
    });
    fixture.detectChanges();

    const labels = Array.from(fixture.nativeElement.querySelectorAll('dt, h3'), (element: Element) => element.textContent?.trim());
    expect(labels).toEqual(expect.arrayContaining(['Option color req.', 'Option card effect', 'Dual effect', 'Link effect', 'Link DP']));
    expect(labels.indexOf('Option card effect')).toBe(labels.indexOf('Option color req.') + 1);
    expect(labels.indexOf('Option color req.')).toBeLessThan(labels.indexOf('Option card effect'));
    expect(labels.indexOf('Option card effect')).toBeLessThan(labels.indexOf('Dual effect'));
    expect(labels.indexOf('Link effect')).toBeLessThan(labels.indexOf('Link DP'));
    expect(labels.filter((label) => label === 'Link DP')).toHaveLength(1);

    fixture.componentRef.setInput('card', {
      ...dummyCard,
      optionCardColourRequirement: '-',
      optionCardEffect: '-',
      dualEffect: '-',
      linkDP: '-',
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Option color req.');
    expect(fixture.nativeElement.textContent).not.toContain('Dual effect');
    expect(fixture.nativeElement.textContent).not.toContain('Link DP');
  });
});
