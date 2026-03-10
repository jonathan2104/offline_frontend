import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusLedgerComponent } from './bonus-ledger.component';

describe('LedgerComponent', () => {
  let component: BonusLedgerComponent;
  let fixture: ComponentFixture<BonusLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusLedgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
