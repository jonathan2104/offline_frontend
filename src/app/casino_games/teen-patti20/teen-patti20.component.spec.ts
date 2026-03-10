import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeenPatti20Component } from './teen-patti20.component';

describe('TeenPatti20Component', () => {
  let component: TeenPatti20Component;
  let fixture: ComponentFixture<TeenPatti20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeenPatti20Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeenPatti20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
