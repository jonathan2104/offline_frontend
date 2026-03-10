import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLadder } from './session-ladder.component';

describe('SessionLadder', () => {
  let component: SessionLadder;
  let fixture: ComponentFixture<SessionLadder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionLadder ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionLadder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
