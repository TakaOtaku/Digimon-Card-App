import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionCircleComponent } from './collection-circle.component';

describe('CollectionCircleComponent', () => {
  let component: CollectionCircleComponent;
  let fixture: ComponentFixture<CollectionCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionCircleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
