import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import {
  FormField,
  TypeForm,
  TypeInput,
} from '../modal-for-form/modal-for-form.interface';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  @Input({ alias: 'form', required: true }) info: WritableSignal<
    Array<FormField>
  >;
  @Input({ required: true }) data: WritableSignal<object>;
  @Input({ alias: 'type', required: true }) typeForm: TypeForm;
  @Output() setForm: EventEmitter<WritableSignal<FormGroup>>;
  form: WritableSignal<FormGroup>;
  typeInput: typeof TypeInput;
  type: typeof TypeForm;
  private formSubscription: Subscription;

  constructor() {
    this.typeInput = TypeInput;
    this.type = TypeForm;
    this.form = signal(new FormGroup({}));
    this.info = signal([]);
    this.data = signal({});
    this.typeForm = TypeForm.CREATE;
    this.setForm = new EventEmitter();
    this.formSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.createForm();
    this.formSubscription = this.form().valueChanges.subscribe((value) => {
      this.setFrom();
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  createForm(): void {
    const form = new FormGroup({});
    if (this.info().length > 0) {
      this.info().forEach((field) => {
        if (field.formControl) {
          form.addControl(field.field, field.formControl());
          if (this.typeForm === TypeForm.UPDATE) {
            field.formControl().setValue((this.data() as any)[field.field]);
          }
        }
      });
    }
    this.form.set(form);
    this.setFrom();
  }

  getOptionValue(option: object): string {
    return (option as any).value;
  }

  getOptionLabel(option: object): string {
    return (option as any).label;
  }

  errorMessage(index: number, field: FormField): string {
    if (field.formControl()) {
      const control = this.form().get(field.field);
      for (const key in control?.errors) {
        if (control?.errors.hasOwnProperty(key)) {
          return (
            field.errors?.find((error) => error.type === key)?.message ?? ''
          );
        }
      }
    }
    return '';
  }

  selectionChange(
    field: FormField,
    value: string,
    form: WritableSignal<FormGroup>
  ) {
    if (field.selectionChange) {
      const result = field.selectionChange(value, this.typeForm, form);
      result.subscribe((value) => {
        // console.log('selectOptionObservable', value());
      });
    }
  }

  private setFrom(): void {
    this.setForm.emit(this.form);
  }
}
