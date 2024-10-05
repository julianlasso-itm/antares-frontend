import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-role-per-professional',
  standalone: true,
  imports: [],
  templateUrl: './role-per-professional.component.html',
  styleUrl: './role-per-professional.component.scss',
})
export class RolePerProfessionalComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
