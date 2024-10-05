import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-technology-types',
  standalone: true,
  imports: [],
  templateUrl: './technology-types.component.html',
  styleUrl: './technology-types.component.scss',
})
export class TechnologyTypesComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
