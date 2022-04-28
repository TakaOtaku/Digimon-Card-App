import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartContainersComponent } from './chart-containers.component';

describe('ChartContainersComponent', () => {
  let component: ChartContainersComponent;
  let fixture: ComponentFixture<ChartContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartContainersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
