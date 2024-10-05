import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-technology-items',
  standalone: true,
  imports: [],
  templateUrl: './technology-items.component.html',
  styleUrl: './technology-items.component.scss',
})
export class TechnologyItemsComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
