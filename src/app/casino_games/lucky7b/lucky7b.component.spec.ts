import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lucky7bComponent } from './lucky7b.component';

describe('Lucky7bComponent', () => {
  let component: Lucky7bComponent;
  let fixture: ComponentFixture<Lucky7bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Lucky7bComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lucky7bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
