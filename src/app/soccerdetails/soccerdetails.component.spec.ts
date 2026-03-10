import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoccerdetailsComponent } from './soccerdetails.component';

describe('SoccerdetailsComponent', () => {
  let component: SoccerdetailsComponent;
  let fixture: ComponentFixture<SoccerdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoccerdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoccerdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
