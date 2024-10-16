import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [],
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.scss',
})
export class ProfessionalsComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
