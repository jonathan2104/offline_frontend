import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoBetSlipComponent } from './casino-bet-slip.component';

describe('CasinoBetSlipComponent', () => {
  let component: CasinoBetSlipComponent;
  let fixture: ComponentFixture<CasinoBetSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoBetSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoBetSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
