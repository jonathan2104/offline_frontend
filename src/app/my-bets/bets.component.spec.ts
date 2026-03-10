import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybetListComponent } from './bets.component';

describe('MybetListComponent', () => {
  let component: MybetListComponent;
  let fixture: ComponentFixture<MybetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MybetListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MybetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
