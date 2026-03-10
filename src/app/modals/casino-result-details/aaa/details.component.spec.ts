import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoAaaPopupComponent } from './details.component';

describe('CasinoAaaPopupComponent', () => {
  let component: CasinoAaaPopupComponent;
  let fixture: ComponentFixture<CasinoAaaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoAaaPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoAaaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
