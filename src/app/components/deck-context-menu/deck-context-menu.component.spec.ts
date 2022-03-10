import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeckContextMenuComponent} from './deck-context-menu.component';

describe('DeckContextMenuComponent', () => {
  let component: DeckContextMenuComponent;
  let fixture: ComponentFixture<DeckContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckContextMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
