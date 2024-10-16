import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
