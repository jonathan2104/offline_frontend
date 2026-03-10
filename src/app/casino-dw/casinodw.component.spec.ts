import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDwComponent } from './casinodw.component';

describe('CasinoDwComponent', () => {
  let component: CasinoDwComponent;
  let fixture: ComponentFixture<CasinoDwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
