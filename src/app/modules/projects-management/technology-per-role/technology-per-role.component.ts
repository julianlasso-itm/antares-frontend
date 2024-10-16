import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-technology-per-role',
  standalone: true,
  imports: [],
  templateUrl: './technology-per-role.component.html',
  styleUrl: './technology-per-role.component.scss',
})
export class TechnologyPerRoleComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
