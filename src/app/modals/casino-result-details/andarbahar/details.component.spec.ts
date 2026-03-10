import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDAndarBaharPopupComponent } from './details.component';

describe('CasinoDAndarBaharPopupComponent', () => {
  let component: CasinoDAndarBaharPopupComponent;
  let fixture: ComponentFixture<CasinoDAndarBaharPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDAndarBaharPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDAndarBaharPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
