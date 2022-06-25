import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckStatsComponent } from './deck-stats.component';

describe('DeckStatsComponent', () => {
  let component: DeckStatsComponent;
  let fixture: ComponentFixture<DeckStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
