import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionStatsDialogComponent } from './collection-stats-dialog.component';

describe('CollectionStatsDialogComponent', () => {
  let component: CollectionStatsDialogComponent;
  let fixture: ComponentFixture<CollectionStatsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionStatsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionStatsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
