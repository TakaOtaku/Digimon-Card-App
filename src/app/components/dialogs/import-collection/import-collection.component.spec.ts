import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImportCollectionComponent} from './import-collection.component';

describe('ImportCollectionComponent', () => {
  let component: ImportCollectionComponent;
  let fixture: ComponentFixture<ImportCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportCollectionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
