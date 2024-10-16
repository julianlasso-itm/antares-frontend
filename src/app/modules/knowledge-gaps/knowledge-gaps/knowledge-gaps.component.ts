import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-knowledge-gaps',
  standalone: true,
  imports: [],
  templateUrl: './knowledge-gaps.component.html',
  styleUrl: './knowledge-gaps.component.scss',
})
export class KnowledgeGapsComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
