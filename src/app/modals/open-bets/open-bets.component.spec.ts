import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenbetsComponent } from './open-bets.component';

describe('OpenbetsComponent', () => {
  let component: OpenbetsComponent;
  let fixture: ComponentFixture<OpenbetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenbetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenbetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
