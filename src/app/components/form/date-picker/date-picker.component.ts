import { CommonModule } from '@angular/common';
import { Component, Input, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '../../modal-for-form/modal-for-form.interface';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  @Input({ required: true }) field!: FormField;
  @Input({ required: true }) form!: WritableSignal<FormGroup>;
  @Input({ required: true }) errorMessage!: (field: FormField) => string;

  getFormControl(): FormControl {
    return this.form().get(this.field.field) as FormControl;
  }
}
