import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BethistoryComponent } from './bet-history.component';

describe('BethistoryComponent', () => {
  let component: BethistoryComponent;
  let fixture: ComponentFixture<BethistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BethistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
