import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositAutopayComponent } from './deposit-autopay.component';

describe('DepositAutopayComponent', () => {
  let component: DepositAutopayComponent;
  let fixture: ComponentFixture<DepositAutopayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositAutopayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositAutopayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
