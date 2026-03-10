import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDetailIgtechComponent } from './detailIGtech.component';

describe('CasinoDetailIgtechComponent', () => {
  let component: CasinoDetailIgtechComponent;
  let fixture: ComponentFixture<CasinoDetailIgtechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDetailIgtechComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDetailIgtechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
