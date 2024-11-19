import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  TypeError,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IResponse } from '../../response.interface';
import { IConfiguration } from '../configurations/configuration.interface';
import { ILevel } from './level.interface';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [MatProgressSpinnerModule, TableComponent],
  templateUrl: '../../../components/generic-crud/generic-crud.component.html',
  styles: [
    `
      .content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;

        app-table {
          min-width: fit-content;
          width: fit-content;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class LevelsComponent extends GenericCrudComponent<ILevel> {
  private readonly route = inject(ActivatedRoute);
  private readonly _configurationName: WritableSignal<string>;

  constructor() {
    super();
    this._filter.set(
      this.route.snapshot.paramMap.get('configurationLevelId') ?? ''
    );
    this._configurationName = signal('');
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Peso', field: 'weight' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.assessments.levels;
    this._menuService.title = `Niveles de la configuración`;
    this._searchBar$.placeholder = 'Buscar un nivel';
    this._errorMessageLoad = 'Error al cargar los datos de los niveles';
    this._titleForModal = {
      create: 'Registrar nivel',
      update: 'Actualizar nivel',
      delete: 'Eliminar nivel',
    };
    this._deletingInProgressMessage = 'Eliminando el nivel';
    this._deleteSuccessMessage = 'Se ha eliminado el nivel';
    this._deleteErrorMessage = 'Error al eliminar el nivel';
    this._updatingStatusMessage = 'Actualizando el estado';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado el nivel';
    this._createErrorMessage = 'Error al registrar el nivel';
    this._updateSuccessMessage = 'Se ha actualizado el nivel';
    this._updateErrorMessage = 'Error al actualizar el nivel';
  }

  override ngOnInit(): void {
    super.ngOnInit();
    const filter = this._filter();
    if (typeof filter === 'string' && filter.length > 0) {
      this.getConfigurationName();
    }
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      {
        field: 'name',
        label: 'Nombre',
        type: TypeInput.TEXT,
        placeholder: 'Nombre del nivel',
        icon: 'altitude',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(30)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El nombre del nivel es requerido',
          },
          {
            type: TypeError.MAX_LENGTH,
            message: 'El nombre del nivel no debe exceder los 30 caracteres',
          },
        ],
      },
      {
        field: 'weight',
        label: 'Peso',
        type: TypeInput.NUMBER,
        placeholder: 'Importancia del nivel. Máximo 1.00 mínimo 0.00',
        icon: 'weight',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.max(1),
              Validators.min(0),
            ],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El peso del nivel es requerido',
          },
          {
            type: TypeError.MAX,
            message: 'El peso del nivel no debe exceder los 1.00',
          },
          {
            type: TypeError.MIN,
            message: 'El peso del nivel no debe ser menor que 0.00',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'levelId',
        type: TypeInput.HIDDEN,
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required],
          })
        ),
      });
    }

    return signal(fields);
  }

  private getConfigurationName(): void {
    this._http$
      .get<IResponse<IConfiguration>>(
        `${environment.endpoint.assessments.configurations}/${this._filter()}`
      )
      .subscribe({
        next: (response) => {
          this._configurationName.set(response.value.name);
          this._menuService.title = `Niveles de la configuración "${response.value.name}"`;
        },
        error: (error) => {
          this.showSnackBar(
            'Error al obtener el nombre de la configuración',
            'error'
          );
          console.error(error);
        },
        complete: () => {},
      });
  }
}
