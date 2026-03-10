import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cashoutComponent } from './cashout.component';

describe('cashoutComponent', () => {
  let component: cashoutComponent;
  let fixture: ComponentFixture<cashoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ cashoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(cashoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
