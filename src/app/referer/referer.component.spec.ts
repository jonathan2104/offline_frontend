import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefererComponent } from './referer.component';

describe('RegisterComponent', () => {
  let component: RefererComponent;
  let fixture: ComponentFixture<RefererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
