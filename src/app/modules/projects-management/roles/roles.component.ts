import { Component, signal, WritableSignal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import { FormField } from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IRole } from './role.interface';

@Component({
  selector: 'app-roles',
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
export class RolesComponent extends GenericCrudComponent<IRole> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Descripción', field: 'description' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.projectsManagement.roles;
    this._searchBar$.placeholder = 'Buscar un rol (posición) en un proyecto';
    this._errorMessageLoad = 'Error al cargar el stack de tecnológico';
    this._titleForModal = {
      create: 'Registrar una tecnología en un proyecto',
      update: 'Actualizar una tecnología en un proyecto',
      delete: 'Eliminar una tecnología en un proyecto',
    };
    this._deletingInProgressMessage =
      'Eliminando una tecnología en un proyecto';
    this._deleteSuccessMessage =
      'Se ha eliminado una tecnología en un proyecto';
    this._deleteErrorMessage =
      'Error al eliminar una tecnología en un proyecto';
    this._updatingStatusMessage = 'Actualizando una tecnología en un proyecto';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage =
      'Se ha registrado una tecnología en un proyecto';
    this._createErrorMessage =
      'Error al registrar una tecnología en un proyecto';
    this._updateSuccessMessage =
      'Se ha actualizado una tecnología en un proyecto';
    this._updateErrorMessage =
      'Error al actualizar una tecnología en un proyecto';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createTextField({
        field: 'name',
        label: 'Nombre',
        placeholder: 'Nombre del rol',
        icon: 'verified_user',
        maxLength: 500,
        required: true,
      }),
      this.createTextAreaField({
        field: 'description',
        label: 'Descripción',
        placeholder: 'Descripción del rol',
        icon: 'description',
        maxLength: 2048,
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('roleId'));
    }

    return signal(fields);
  }
}
