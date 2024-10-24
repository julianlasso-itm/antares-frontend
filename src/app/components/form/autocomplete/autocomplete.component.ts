import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '../../modal-for-form/modal-for-form.interface';
import { ISelectData } from '../select-data.interface';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent {
  @ViewChild('inputAutoComplete') inputAutoComplete!: ElementRef;
  @Input({ required: true }) field: FormField;
  @Input({ required: true }) form: WritableSignal<FormGroup>;
  @Input({ required: true }) errorMessage: (field: FormField) => string;
  filteredOptions: WritableSignal<ISelectData[]>;
  private readonly _currentValue: WritableSignal<string>;

  constructor() {
    this.field = {} as FormField;
    this.form = signal({} as FormGroup);
    this.errorMessage = () => '';
    this.filteredOptions = signal([]);
    this._currentValue = signal('');

    effect(
      () => {
        const value = this._currentValue();
        if (this.field.autocompleteOptions) {
          this.field.autocompleteOptions(value, this.form).subscribe({
            next: (data) => {
              this.filteredOptions.set(data());
            },
            error: (error) => {
              this.form.update((form) => {
                form.get(this.field.field)?.disable();
                return form;
              });
              console.error(error);
            },
            complete: () => {
              this.form.update((form) => {
                form.get(this.field.field)?.enable();
                return form;
              });
            },
          });
        }
      },
      { allowSignalWrites: true }
    );
  }

  getFormControl(): FormControl {
    return this.form().get(this.field.field) as FormControl;
  }

  onInputChange(value: string): void {
    this.getFormControl().setValue(null);
    this._currentValue.set(value);
  }

  onOptionSelected(value: string): void {
    if (this.field.selectionChange) {
      this.field.selectionChange(value, this.field.type, this.form).subscribe();
    }
  }

  displayWith(value: ISelectData): string {
    const selected = this.filteredOptions().find(
      (option) => option === value
    );
    if (selected) {
      return selected.label;
    }
    return this.inputAutoComplete.nativeElement.value;
  }
}
