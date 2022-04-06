import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCardDialogComponent } from './view-card-dialog.component';

describe('ViewCardDialogComponent', () => {
  let component: ViewCardDialogComponent;
  let fixture: ComponentFixture<ViewCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCardDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
