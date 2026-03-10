import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoWithdrawComponent } from './withdraw-form.component';

describe('CasinoWithdrawComponent', () => {
  let component: CasinoWithdrawComponent;
  let fixture: ComponentFixture<CasinoWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoWithdrawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
