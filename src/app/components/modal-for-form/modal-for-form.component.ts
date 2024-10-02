import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormComponent } from '../form';
import { IModalForForm } from './modal-for-form.interface';

@Component({
  selector: 'app-modal-for-form',
  standalone: true,
  imports: [FormComponent, MatDialogModule, MatButtonModule],
  templateUrl: './modal-for-form.component.html',
  styleUrl: './modal-for-form.component.scss',
})
export class ModalForFormComponent {
  form: WritableSignal<FormGroup>;

  constructor(
    public dialogRef: MatDialogRef<ModalForFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IModalForForm<object>
  ) {
    this.form = signal(new FormGroup({}));
  }

  ngOnInit(): void {
    console.log('data', this.data);
  }

  setForm(form: WritableSignal<FormGroup>): void {
    this.form.set(form());
    console.log('form', this.form());
  }
}
