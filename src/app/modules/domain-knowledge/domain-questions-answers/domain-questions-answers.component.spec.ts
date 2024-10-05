import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainQuestionsAnswersComponent } from './domain-questions-answers.component';

describe('DomainQuestionsAnswersComponent', () => {
  let component: DomainQuestionsAnswersComponent;
  let fixture: ComponentFixture<DomainQuestionsAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainQuestionsAnswersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DomainQuestionsAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
