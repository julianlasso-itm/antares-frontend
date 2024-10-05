import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-rating-scale',
  standalone: true,
  imports: [],
  templateUrl: './rating-scale.component.html',
  styleUrl: './rating-scale.component.scss',
})
export class RatingScaleComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
