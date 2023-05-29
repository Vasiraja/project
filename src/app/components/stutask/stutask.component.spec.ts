import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StutaskComponent } from './stutask.component';

describe('StutaskComponent', () => {
  let component: StutaskComponent;
  let fixture: ComponentFixture<StutaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StutaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StutaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
