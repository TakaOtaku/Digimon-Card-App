import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDeckDialogComponent } from './import-deck-dialog.component';

describe('ImportDeckDialogComponent', () => {
  let component: ImportDeckDialogComponent;
  let fixture: ComponentFixture<ImportDeckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDeckDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDeckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
