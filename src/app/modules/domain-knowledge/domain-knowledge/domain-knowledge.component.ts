import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-domain-knowledge',
  standalone: true,
  imports: [],
  templateUrl: './domain-knowledge.component.html',
  styleUrl: './domain-knowledge.component.scss',
})
export class DomainKnowledgeComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
