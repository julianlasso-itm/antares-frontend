import { HttpParams } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectData } from '../../../components/form/select-data.interface';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  TypeError,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { IConfiguration } from '../configurations/configuration.interface';
import { IRatingScale } from './rating-scale.interface';

@Component({
  selector: 'app-rating-scale',
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
          width: 70%;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class RatingScaleComponent extends GenericCrudComponent<IRatingScale> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Valor', field: 'value' },
      { name: 'Posición', field: 'position' },
      { name: 'Configuración', field: 'configurationLevel.name' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.assessments.ratingScale;
    this._searchBar$.placeholder = 'Buscar una escala de calificación';
    this._errorMessageLoad =
      'Error al cargar los datos de las escalas de calificación';
    this._titleForModal = {
      create: 'Registrar escala de calificación',
      update: 'Actualizar escala de calificación',
      delete: 'Eliminar escala de calificación',
    };
    this._deletingInProgressMessage = 'Eliminando escala de calificación';
    this._deleteSuccessMessage = 'Se ha eliminado la escala de calificación';
    this._deleteErrorMessage = 'Error al eliminar la escala de calificación';
    this._updatingStatusMessage = 'Actualizando el estado';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado la escala de calificación';
    this._createErrorMessage = 'Error al registrar la escala de calificación';
    this._updateSuccessMessage = 'Se ha actualizado la escala de calificación';
    this._updateErrorMessage = 'Error al actualizar la escala de calificación';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      {
        field: 'name',
        label: 'Nombre',
        type: TypeInput.TEXT,
        placeholder: 'Nombre de la escala de calificación',
        icon: 'scale',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(80)],
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
              'El nombre de la configuración no debe exceder los 80 caracteres',
          },
        ],
      },
      {
        field: 'description',
        label: 'Descripción',
        type: TypeInput.TEXTAREA,
        placeholder: 'Descripción de la escala de calificación',
        icon: 'description',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(500)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'La descripción de la escala de calificación es requerida',
          },
          {
            type: TypeError.MAX_LENGTH,
            message:
              'La descripción de la escala de calificación no debe exceder los 500 caracteres',
          },
        ],
      },
      {
        field: 'value',
        label: 'Valor',
        type: TypeInput.NUMBER,
        placeholder: 'Valor de la escala de calificación',
        icon: '123',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(5),
            ],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El valor de la escala de calificación es requerido',
          },
          {
            type: TypeError.MIN,
            message:
              'El valor de la escala de calificación no debe ser menor que 0.00',
          },
          {
            type: TypeError.MAX,
            message:
              'El valor de la escala de calificación no debe ser mayor que 5.00',
          },
        ],
      },
      {
        field: 'position',
        label: 'Posición',
        type: TypeInput.NUMBER,
        placeholder: 'Posición de la escala de calificación',
        icon: 'format_list_numbered',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'La posición de la escala de calificación es requerida',
          },
          {
            type: TypeError.MIN,
            message:
              'La posición de la escala de calificación no debe ser menor que 1',
          },
        ],
      },
      {
        field: 'configurationLevelId',
        label: 'Configuración',
        type: TypeInput.SELECT,
        placeholder: 'Nombre de la configuración',
        icon: 'settings',
        loadOptions: this.loadConfigurations(),
        selectionChange: () => of(),
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'La configuración es requerida',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'ratingScaleId',
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

  private loadConfigurations(): Observable<WritableSignal<ISelectData[]>> {
    const param = new HttpParams().set('page', '0').set('size', '99999999');
    return this._http$
      .get<IResponse<IFindAllResponse<IConfiguration>>>(
        `${environment.endpoint.assessments.configurations}`,
        param
      )
      .pipe(
        map((response) => {
          return signal(
            response.value.data.map(
              (configuration) =>
                ({
                  value: configuration.configurationLevelId,
                  label: configuration.name,
                } as ISelectData)
            )
          );
        }),
        catchError((error) => {
          this.showSnackBar('Error al cargar las configuraciones', 'error');
          console.error(error);
          return of(signal([]));
        })
      );
  }

  protected override changeStatusSubmit(data: IRatingScale): void {
    delete data.configurationLevel;
    super.changeStatusSubmit(data);
  }
}
