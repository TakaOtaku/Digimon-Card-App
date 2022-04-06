import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDecksComponent } from './community-decks.component';

describe('CommunityDecksComponent', () => {
  let component: CommunityDecksComponent;
  let fixture: ComponentFixture<CommunityDecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityDecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityDecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
