import { Component, inject } from '@angular/core';
import { ButtonAddService } from '../../../services/button-add.service';

@Component({
  selector: 'app-knowledge-gap-notes',
  standalone: true,
  imports: [],
  templateUrl: './knowledge-gap-notes.component.html',
  styleUrl: './knowledge-gap-notes.component.scss',
})
export class KnowledgeGapNotesComponent {
  private readonly _buttonAddService = inject(ButtonAddService);

  constructor() {
    this._buttonAddService.visible = true;
    this._buttonAddService.action = () => {
      console.log('Agregar');
    };
  }
}
