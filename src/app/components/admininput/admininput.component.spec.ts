import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmininputComponent } from './admininput.component';

describe('AdmininputComponent', () => {
  let component: AdmininputComponent;
  let fixture: ComponentFixture<AdmininputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmininputComponent]
    });
    fixture = TestBed.createComponent(AdmininputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
