import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDeckBuilderComponent } from './mobile-deck-builder.component';

describe('MobileDeckBuilderComponent', () => {
  let component: MobileDeckBuilderComponent;
  let fixture: ComponentFixture<MobileDeckBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileDeckBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDeckBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
