import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiButtonsComponent } from './multi-buttons.component';

describe('MultiButtonsComponent', () => {
  let component: MultiButtonsComponent;
  let fixture: ComponentFixture<MultiButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiButtonsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
