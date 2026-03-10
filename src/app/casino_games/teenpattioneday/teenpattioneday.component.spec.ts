import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeenPattiOnedayomponent } from './teenpattioneday.component';

describe('TeenPattiOnedayomponent', () => {
  let component: TeenPattiOnedayomponent;
  let fixture: ComponentFixture<TeenPattiOnedayomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeenPattiOnedayomponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeenPattiOnedayomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
