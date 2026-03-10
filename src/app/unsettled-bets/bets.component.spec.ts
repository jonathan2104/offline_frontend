import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsettlebetListComponent } from './bets.component';

describe('UnsettlebetListComponent', () => {
  let component: UnsettlebetListComponent;
  let fixture: ComponentFixture<UnsettlebetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsettlebetListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsettlebetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
