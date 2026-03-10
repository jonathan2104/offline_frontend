import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisdetailsComponent } from './tennisdetails.component';

describe('TennisdetailsComponent', () => {
  let component: TennisdetailsComponent;
  let fixture: ComponentFixture<TennisdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TennisdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TennisdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
