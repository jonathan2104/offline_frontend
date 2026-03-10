import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDragonTigerLionPopupComponent } from './details.component';

describe('CasinoDragonTigerLionPopupComponent', () => {
  let component: CasinoDragonTigerLionPopupComponent;
  let fixture: ComponentFixture<CasinoDragonTigerLionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDragonTigerLionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDragonTigerLionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
