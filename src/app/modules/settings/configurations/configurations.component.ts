import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ModalForFormComponent } from '../../../components/modal-for-form/modal-for-form.component';
import {
  FormField,
  IModalForForm,
  TypeError,
  TypeForm,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { HttpService } from '../../../services/http.service';
import { IResponse } from '../../response.interface';
import { IAction, IConfiguration } from './configuration.interface';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [TableComponent, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss',
})
export class ConfigurationsComponent {
  dataSource: WritableSignal<IConfiguration[]>;
  displayedColumns = signal([
    { name: 'Nombre', field: 'name' },
    { name: 'Acciones', field: 'actions' },
  ]);
  loading: WritableSignal<boolean>;
  private getCustomers: Subscription;
  private readonly _httpService = inject(HttpService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialog = inject(MatDialog);
  private readonly createModal: WritableSignal<
    MatDialogConfig<IModalForForm<IConfiguration>>
  >;
  private readonly _urlCustomers = '/assessments/configuration-levels';

  constructor() {
    this.loading = signal(false);
    this.dataSource = signal([]);
    this.getCustomers = new Subscription();
    this.createModal = signal({
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: {
        title: 'Registrar configuración',
        submit: this.createConfigurationSubmit.bind(this),
        action: 'Registrar',
        form: this.getFieldsInfo(),
        data: signal({} as IConfiguration),
        typeForm: TypeForm.CREATE,
      },
    });
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.getCustomers = this._httpService
      .get<IResponse<IConfiguration[]>>(this._urlCustomers)
      .subscribe({
        next: (response) => {
          response.value.forEach((configuration) => {
            configuration.actions = this.getActions(configuration);
          });
          this.dataSource.set(response.value);
        },
        error: (error) => {
          this._snackBar.open(
            'Error al cargar los datos de las configuraciones',
            'Cerrar',
            {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: 'custom-snack-bar',
            }
          );
          console.error(error);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  pageEvent(event: PageEvent) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.getCustomers.unsubscribe();
    console.log('destroyed');
  }

  /**
   * Método para obtener las acciones de un registro de configuración
   * @param configuration - Objeto de configuración
   * @returns Acciones
   */
  private getActions(configuration: IConfiguration): IAction[] {
    return [
      {
        icon: 'groups',
        tooltip: 'Niveles',
        action: () => {
          console.log('Niveles');
        },
      },
      {
        icon: 'linear_scale',
        tooltip: 'Escala de calificación',
        action: () => {
          console.log('Escala de calificación');
        },
      },
      {
        icon: 'edit',
        tooltip: 'Editar',
        action: () => {
          this._dialog.open(ModalForFormComponent, this.createModal());
        },
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar',
        action: () => {
          console.log('Eliminar', configuration);
        },
      },
    ];
  }

  createConfiguration() {
    this._dialog.open(ModalForFormComponent, this.createModal());
  }

  /**
   * Método para registrar una nueva configuración en el back-end
   * @param config - Datos del formulario
   */
  private createConfigurationSubmit(config: IConfiguration): void {
    console.log('Create', config);
  }

  /**
   * Método para obtener la configuración de los campos del formulario
   * @returns Configuración de los campos del formulario
   */
  private getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<Array<FormField>> {
    const id = {
      field: 'configurationLevelId',
      type: TypeInput.HIDDEN,
      formControl: signal(
        new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required],
        })
      ),
    };
    return signal([
      ...(withId ? [id] : []),
      {
        field: 'name',
        label: 'Nombre',
        type: TypeInput.TEXT,
        placeholder: 'Nombre de la configuración',
        icon: 'settings',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(50)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El nombre de la configuración es requerido',
          },
          {
            type: TypeError.MAX_LENGTH,
            message:
              'El nombre de la configuración no debe exceder los 50 caracteres',
          },
        ],
      },
    ]);
  }
}
