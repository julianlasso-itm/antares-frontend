import { Component, HostListener, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ModalStateService } from '../../../../../services/modal-state.service';
import { IQuestionAndAnswer } from './question-and-answer.interface';

@Component({
  selector: 'app-questions-and-answers-modal',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './questions-and-answers-modal.component.html',
  styleUrl: './questions-and-answers-modal.component.scss',
})
export class QuestionsAndAnswersModalComponent {
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.close();
  }

  private readonly _modalState$ = inject(ModalStateService);
  private readonly _dialogRef = inject(
    MatDialogRef<QuestionsAndAnswersModalComponent>
  );
  readonly _data = inject<IQuestionAndAnswer[]>(MAT_DIALOG_DATA);
  readonly questionsAndAnswers = model(this._data);

  constructor() {
    this._modalState$.state = true;
  }

  close(): void {
    this._dialogRef.close();
    this._modalState$.state = false;
  }
}
