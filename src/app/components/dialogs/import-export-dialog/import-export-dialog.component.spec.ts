import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportExportDialogComponent} from './import-export-dialog.component';

describe('ImportExportDialogComponent', () => {
  let component: ImportExportDialogComponent;
  let fixture: ComponentFixture<ImportExportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportExportDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
