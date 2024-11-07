import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsAndAnswersModalComponent } from './questions-and-answers-modal.component';

describe('QuestionsAndAnswersModalComponent', () => {
  let component: QuestionsAndAnswersModalComponent;
  let fixture: ComponentFixture<QuestionsAndAnswersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsAndAnswersModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsAndAnswersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
