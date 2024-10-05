import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-domain-knowledge-levels',
  standalone: true,
  imports: [],
  templateUrl: './domain-knowledge-levels.component.html',
  styleUrl: './domain-knowledge-levels.component.scss',
})
export class DomainKnowledgeLevelsComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
