import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossBackReportComponent } from './lossback-report.component';

describe('LossBackReportComponent', () => {
  let component: LossBackReportComponent;
  let fixture: ComponentFixture<LossBackReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossBackReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LossBackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
