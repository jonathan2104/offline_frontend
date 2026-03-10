import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragonTigert20Component } from './dragontigert20.component';

describe('DragonTigert20Component', () => {
  let component: DragonTigert20Component;
  let fixture: ComponentFixture<DragonTigert20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragonTigert20Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragonTigert20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
