import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportDeckComponent} from './export-deck.component';

describe('ExportDeckComponent', () => {
  let component: ExportDeckComponent;
  let fixture: ComponentFixture<ExportDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportDeckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
