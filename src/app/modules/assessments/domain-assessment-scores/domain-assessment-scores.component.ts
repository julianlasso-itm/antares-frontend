import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-domain-assessment-scores',
  standalone: true,
  imports: [],
  templateUrl: './domain-assessment-scores.component.html',
  styleUrl: './domain-assessment-scores.component.scss',
})
export class DomainAssessmentScoresComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
