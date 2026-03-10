import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDragonTigerPopupComponent } from './details.component';

describe('CasinoDragonTigerPopupComponent', () => {
  let component: CasinoDragonTigerPopupComponent;
  let fixture: ComponentFixture<CasinoDragonTigerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDragonTigerPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDragonTigerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
