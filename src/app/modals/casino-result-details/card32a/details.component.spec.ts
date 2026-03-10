import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDCardTreeTwoAPopupComponent } from './details.component';

describe('CasinoDCardTreeTwoAPopupComponent', () => {
  let component: CasinoDCardTreeTwoAPopupComponent;
  let fixture: ComponentFixture<CasinoDCardTreeTwoAPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDCardTreeTwoAPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDCardTreeTwoAPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
