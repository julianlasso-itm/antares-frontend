import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-configuration-per-level',
  standalone: true,
  imports: [],
  templateUrl: './configuration-per-level.component.html',
  styleUrl: './configuration-per-level.component.scss',
})
export class ConfigurationPerLevelComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
