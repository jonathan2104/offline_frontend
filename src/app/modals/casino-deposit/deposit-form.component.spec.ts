import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDepositComponent } from './deposit-form.component';

describe('CasinoDepositComponent', () => {
  let component: CasinoDepositComponent;
  let fixture: ComponentFixture<CasinoDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
