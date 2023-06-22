import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateresumeComponent } from './generateresume.component';

describe('GenerateresumeComponent', () => {
  let component: GenerateresumeComponent;
  let fixture: ComponentFixture<GenerateresumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateresumeComponent]
    });
    fixture = TestBed.createComponent(GenerateresumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
