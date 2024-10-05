import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-knowledge-gaps',
  standalone: true,
  imports: [],
  templateUrl: './knowledge-gaps.component.html',
  styleUrl: './knowledge-gaps.component.scss',
})
export class KnowledgeGapsComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
