import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDeckDialogComponent } from './export-deck-dialog.component';

describe('ExportDeckDialogComponent', () => {
  let component: ExportDeckDialogComponent;
  let fixture: ComponentFixture<ExportDeckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportDeckDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDeckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
