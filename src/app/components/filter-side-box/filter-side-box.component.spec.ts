import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSideBoxComponent } from './filter-side-box.component';

describe('FilterSideBoxComponent', () => {
  let component: FilterSideBoxComponent;
  let fixture: ComponentFixture<FilterSideBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSideBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSideBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
