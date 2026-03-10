import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofListComponent } from './proof-list.component';

describe('ProofListComponent', () => {
  let component: ProofListComponent;
  let fixture: ComponentFixture<ProofListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProofListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProofListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
