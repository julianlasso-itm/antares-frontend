import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [],
  templateUrl: './assessments.component.html',
  styleUrl: './assessments.component.scss',
})
export class AssessmentsComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
