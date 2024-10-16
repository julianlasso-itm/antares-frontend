import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-role-per-professional',
  standalone: true,
  imports: [],
  templateUrl: './role-per-professional.component.html',
  styleUrl: './role-per-professional.component.scss',
})
export class RolePerProfessionalComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
