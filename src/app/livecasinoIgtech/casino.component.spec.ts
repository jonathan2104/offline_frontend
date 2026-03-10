import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivecasinoIgtechComponent } from './casino.component';

describe('LivecasinoIgtechComponent', () => {
  let component: LivecasinoIgtechComponent;
  let fixture: ComponentFixture<LivecasinoIgtechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivecasinoIgtechComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivecasinoIgtechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
