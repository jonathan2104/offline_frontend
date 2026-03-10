import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragonTigeronedayComponent } from './dragontigeroneday.component';

describe('DragonTigeronedayComponent', () => {
  let component: DragonTigeronedayComponent;
  let fixture: ComponentFixture<DragonTigeronedayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragonTigeronedayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragonTigeronedayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
