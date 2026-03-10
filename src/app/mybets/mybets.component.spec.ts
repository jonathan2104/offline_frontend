import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybetsComponent } from './mybets.component';

describe('MybetsComponent', () => {
  let component: MybetsComponent;
  let fixture: ComponentFixture<MybetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MybetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MybetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
