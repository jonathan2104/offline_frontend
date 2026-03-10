import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoLedgerComponent } from './ledger.component';

describe('CasinoLedgerComponent', () => {
  let component: CasinoLedgerComponent;
  let fixture: ComponentFixture<CasinoLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoLedgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
