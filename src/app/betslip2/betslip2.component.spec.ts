import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Betslip2Component } from './betslip2.component';

describe('Betslip2Component', () => {
  let component: Betslip2Component;
  let fixture: ComponentFixture<Betslip2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Betslip2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Betslip2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
