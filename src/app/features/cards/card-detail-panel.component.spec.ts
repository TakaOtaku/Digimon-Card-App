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
});
