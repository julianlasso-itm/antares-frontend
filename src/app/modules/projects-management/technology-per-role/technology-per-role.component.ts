import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-technology-per-role',
  standalone: true,
  imports: [],
  templateUrl: './technology-per-role.component.html',
  styleUrl: './technology-per-role.component.scss',
})
export class TechnologyPerRoleComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
