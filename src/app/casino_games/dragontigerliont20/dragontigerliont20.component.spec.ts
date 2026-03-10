import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragonTigerLiont20Component } from './dragontigerliont20.component';

describe('DragonTigerLiont20Component', () => {
  let component: DragonTigerLiont20Component;
  let fixture: ComponentFixture<DragonTigerLiont20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragonTigerLiont20Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragonTigerLiont20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
