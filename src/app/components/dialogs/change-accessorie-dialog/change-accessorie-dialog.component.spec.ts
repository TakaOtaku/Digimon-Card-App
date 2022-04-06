import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAccessorieDialogComponent } from './change-accessorie-dialog.component';

describe('ChangeAccessorieDialogComponent', () => {
  let component: ChangeAccessorieDialogComponent;
  let fixture: ComponentFixture<ChangeAccessorieDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAccessorieDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAccessorieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
