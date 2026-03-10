import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDLuckyPopupComponent } from '../lucky7/details.component';

describe('CasinoDLuckyPopupComponent', () => {
  let component: CasinoDLuckyPopupComponent;
  let fixture: ComponentFixture<CasinoDLuckyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDLuckyPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDLuckyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
