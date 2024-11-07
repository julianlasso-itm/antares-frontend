import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentExecutionComponent } from './assessment-execution.component';

describe('AssessmentExecutionComponent', () => {
  let component: AssessmentExecutionComponent;
  let fixture: ComponentFixture<AssessmentExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentExecutionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
