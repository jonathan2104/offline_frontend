import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDTennPattiOneDayPopupComponent } from './details.component';

describe('CasinoDTennPattiOneDayPopupComponent', () => {
  let component: CasinoDTennPattiOneDayPopupComponent;
  let fixture: ComponentFixture<CasinoDTennPattiOneDayPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDTennPattiOneDayPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDTennPattiOneDayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
