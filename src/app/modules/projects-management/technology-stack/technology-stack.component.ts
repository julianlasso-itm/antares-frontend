import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-technology-stack',
  standalone: true,
  imports: [],
  templateUrl: './technology-stack.component.html',
  styleUrl: './technology-stack.component.scss',
})
export class TechnologyStackComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
