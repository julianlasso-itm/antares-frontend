import { Component, inject } from '@angular/core';
import { ButtonHeaderService } from '../../../services/button-header.service';

@Component({
  selector: 'app-knowledge-gap-notes',
  standalone: true,
  imports: [],
  templateUrl: './knowledge-gap-notes.component.html',
  styleUrl: './knowledge-gap-notes.component.scss',
})
export class KnowledgeGapNotesComponent {
  private readonly _buttonHeaderService = inject(ButtonHeaderService);

  constructor() {
    this._buttonHeaderService.visibleAdd = true;
    this._buttonHeaderService.actionAdd = () => {
      console.log('Agregar');
    };
  }
}
