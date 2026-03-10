import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDTennPattiPopupComponent } from './details.component';

describe('CasinoDTennPattiPopupComponent', () => {
  let component: CasinoDTennPattiPopupComponent;
  let fixture: ComponentFixture<CasinoDTennPattiPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDTennPattiPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDTennPattiPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
