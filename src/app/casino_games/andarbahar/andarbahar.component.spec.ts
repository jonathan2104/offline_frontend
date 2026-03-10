import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndarBaharComponent } from './andarbahar.component';

describe('AndarBaharComponent', () => {
  let component: AndarBaharComponent;
  let fixture: ComponentFixture<AndarBaharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AndarBaharComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndarBaharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
