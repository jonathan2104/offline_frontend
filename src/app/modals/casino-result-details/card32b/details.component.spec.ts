import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDCardTreeTwoBPopupComponent } from './details.component';

describe('CasinoDCardTreeTwoBPopupComponent', () => {
  let component: CasinoDCardTreeTwoBPopupComponent;
  let fixture: ComponentFixture<CasinoDCardTreeTwoBPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDCardTreeTwoBPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDCardTreeTwoBPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
