import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-domain-questions-answers',
  standalone: true,
  imports: [],
  templateUrl: './domain-questions-answers.component.html',
  styleUrl: './domain-questions-answers.component.scss',
})
export class DomainQuestionsAnswersComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
