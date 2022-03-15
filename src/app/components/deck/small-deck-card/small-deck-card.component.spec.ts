import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallDeckCardComponent } from './small-deck-card.component';

describe('SmallDeckCardComponent', () => {
  let component: SmallDeckCardComponent;
  let fixture: ComponentFixture<SmallDeckCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallDeckCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallDeckCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
