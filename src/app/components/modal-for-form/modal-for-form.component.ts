import {
  Component,
  HostListener,
  inject,
  Inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ModalStateService } from '../../services/modal-state.service';
import { OperationBackendService } from '../../services/operation-backend.service';
import { FormComponent } from '../form/form.component';
import { IModalForForm } from './modal-for-form.interface';

@Component({
  selector: 'app-modal-for-form',
  standalone: true,
  imports: [
    FormComponent,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './modal-for-form.component.html',
  styleUrl: './modal-for-form.component.scss',
})
export class ModalForFormComponent {
  form: WritableSignal<FormGroup>;
  private readonly _modalStateService = inject(ModalStateService);
  private _operationBackendSubscription: Subscription;
  private readonly _operationBackendService = inject(OperationBackendService);
  operationBackend: WritableSignal<boolean>;

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.close();
  }

  constructor(
    public dialogRef: MatDialogRef<ModalForFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IModalForForm<object>
  ) {
    this.form = signal(new FormGroup({}));
    this.operationBackend = signal(false);
    this._operationBackendSubscription = new Subscription();
    this._modalStateService.state = true;
  }

  ngOnInit(): void {
    this.operationBackend = signal(this._operationBackendService.visible);
    this._operationBackendSubscription =
      this._operationBackendService.visible$.subscribe({
        next: (visible) => {
          this.operationBackend.set(visible);
        },
      });
  }

  ngOnDestroy(): void {
    this._operationBackendSubscription.unsubscribe();
  }

  setForm(form: WritableSignal<FormGroup>): void {
    this.form.set(form());
  }

  close(): void {
    this.form.update((form) => {
      form.reset();
      return form;
    });
    this.dialogRef.close();
    this._modalStateService.state = false;
  }

  submit(): void {
    this.data.submit(this.form().value, this.form, this.close.bind(this));
  }
}
