import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLookingComponent } from './not-looking.component';

describe('NotLookingComponent', () => {
  let component: NotLookingComponent;
  let fixture: ComponentFixture<NotLookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotLookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotLookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
