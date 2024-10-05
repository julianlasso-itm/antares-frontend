import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainAssessmentScoresComponent } from './domain-assessment-scores.component';

describe('DomainAssessmentScoresComponent', () => {
  let component: DomainAssessmentScoresComponent;
  let fixture: ComponentFixture<DomainAssessmentScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainAssessmentScoresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DomainAssessmentScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
