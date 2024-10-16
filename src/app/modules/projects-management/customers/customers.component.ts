import { Component, signal, WritableSignal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import { FormField } from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { ICustomer } from './customer.interface';

@Component({
  selector: 'app-customers',
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
export class CustomersComponent extends GenericCrudComponent<ICustomer> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.projectsManagement.customers;
    this._searchBar$.placeholder = 'Buscar un cliente';
    this._errorMessageLoad = 'Error al cargar los clientes de la empresa';
    this._titleForModal = {
      create: 'Registrar un cliente',
      update: 'Actualizar un cliente',
      delete: 'Eliminar un cliente',
    };
    this._deletingInProgressMessage = 'Eliminando un cliente';
    this._deleteSuccessMessage = 'Se ha eliminado un cliente';
    this._deleteErrorMessage = 'Error al eliminar un cliente';
    this._updatingStatusMessage = 'Actualizando un cliente';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado un cliente';
    this._createErrorMessage = 'Error al registrar un cliente';
    this._updateSuccessMessage = 'Se ha actualizado un cliente';
    this._updateErrorMessage = 'Error al actualizar un cliente';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createTextField({
        field: 'name',
        label: 'Nombre',
        placeholder: 'Nombre del cliente',
        icon: 'person',
        maxLength: 500,
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('customerId'));
    }

    return signal(fields);
  }
}
