import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdationComponent } from './updation.component';

describe('UpdationComponent', () => {
  let component: UpdationComponent;
  let fixture: ComponentFixture<UpdationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
