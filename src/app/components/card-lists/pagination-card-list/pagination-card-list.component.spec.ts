import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationCardListComponent } from './pagination-card-list.component';

describe('PaginationCardListComponent', () => {
  let component: PaginationCardListComponent;
  let fixture: ComponentFixture<PaginationCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationCardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
