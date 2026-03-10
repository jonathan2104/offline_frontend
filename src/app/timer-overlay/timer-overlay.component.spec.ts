import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerOverlayComponent } from './timer-overlay.component';

describe('TimerOverlayComponent', () => {
  let component: TimerOverlayComponent;
  let fixture: ComponentFixture<TimerOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
