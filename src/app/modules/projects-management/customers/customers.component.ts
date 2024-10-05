import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
