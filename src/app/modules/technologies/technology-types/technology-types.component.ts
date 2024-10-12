import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  TypeError,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { ITechnologyType } from './technology-types.interface';

@Component({
  selector: 'app-technology-types',
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
          width: 55%;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class TechnologyTypesComponent extends GenericCrudComponent<ITechnologyType> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Descripción', field: 'description' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.technologies.types;
    this._searchBar$.placeholder = 'Buscar un tipo de tecnología';
    this._errorMessageLoad =
      'Error al cargar los datos de los tipos de tecnologías';
    this._titleForModal = {
      create: 'Registrar un tipo de tecnología',
      update: 'Actualizar un tipo de tecnología',
      delete: 'Eliminar un tipo de tecnología',
    };
    this._deletingInProgressMessage = 'Eliminando un tipo de tecnología';
    this._deleteSuccessMessage = 'Se ha eliminado un tipo de tecnología';
    this._deleteErrorMessage = 'Error al eliminar un tipo de tecnología';
    this._updatingStatusMessage = 'Actualizando un tipo de tecnología';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado un tipo de tecnología';
    this._createErrorMessage = 'Error al registrar un tipo de tecnología';
    this._updateSuccessMessage = 'Se ha actualizado un tipo de tecnología';
    this._updateErrorMessage = 'Error al actualizar un tipo de tecnología';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      {
        field: 'name',
        label: 'Nombre',
        type: TypeInput.TEXT,
        placeholder: 'Nombre del tipo de tecnología',
        icon: 'format_line_spacing',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(500)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El nombre del tipo de tecnología es requerido',
          },
          {
            type: TypeError.MAX_LENGTH,
            message:
              'El nombre del tipo de tecnología no debe exceder los 500 caracteres',
          },
        ],
      },
      {
        field: 'description',
        label: 'Descripción',
        type: TypeInput.TEXTAREA,
        placeholder: 'Descripción del tipo de tecnología',
        icon: 'description',
        formControl: signal(
          new FormControl(null, {
            validators: [Validators.maxLength(2048)],
          })
        ),
        errors: [
          {
            type: TypeError.MAX_LENGTH,
            message:
              'La descripción del tipo de tecnología no debe exceder los 2048 caracteres',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'technologyTypeId',
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
}
