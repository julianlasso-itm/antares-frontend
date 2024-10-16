import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-domain-assessment-scores',
  standalone: true,
  imports: [],
  templateUrl: './domain-assessment-scores.component.html',
  styleUrl: './domain-assessment-scores.component.scss',
})
export class DomainAssessmentScoresComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
