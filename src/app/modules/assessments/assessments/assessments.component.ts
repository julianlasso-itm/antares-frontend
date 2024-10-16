import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [],
  templateUrl: './assessments.component.html',
  styleUrl: './assessments.component.scss',
})
export class AssessmentsComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
