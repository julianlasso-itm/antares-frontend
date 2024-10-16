import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-technology-stack',
  standalone: true,
  imports: [],
  templateUrl: './technology-stack.component.html',
  styleUrl: './technology-stack.component.scss',
})
export class TechnologyStackComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
