import { Component, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IDeleteModalData } from './delete-modal-data.interface';
import { ModalStateService } from '../../services/modal-state.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
  private readonly _modalStateService = inject(ModalStateService);
  private readonly _dialogRef = inject(MatDialogRef<DeleteModalComponent>);
  readonly _data = inject<IDeleteModalData>(MAT_DIALOG_DATA);
  readonly id = model(this._data.id);
  readonly name = model(this._data.name);

  constructor() {
    this._modalStateService.state = true;
  }

  close(): void {
    this._dialogRef.close();
    this._modalStateService.state = false;
  }

  closeWithId(): void {
    this._dialogRef.close(this.id());
    this._modalStateService.state = false;
  }
}
