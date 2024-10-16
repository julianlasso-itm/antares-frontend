import { HttpParams } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectData } from '../../../components/form/select-data.interface';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import { FormField } from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { ICustomer } from '../customers/customer.interface';
import { IProject } from './project.interface';

@Component({
  selector: 'app-projects',
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
export class ProjectsComponent extends GenericCrudComponent<IProject> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Cliente', field: 'customer.name' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.projectsManagement.projects;
    this._searchBar$.placeholder = 'Buscar un proyecto';
    this._errorMessageLoad = 'Error al cargar los proyectos';
    this._titleForModal = {
      create: 'Registrar un proyecto',
      update: 'Actualizar un proyecto',
      delete: 'Eliminar un proyecto',
    };
    this._deletingInProgressMessage = 'Eliminando un proyecto';
    this._deleteSuccessMessage = 'Se ha eliminado un proyecto';
    this._deleteErrorMessage = 'Error al eliminar un proyecto';
    this._updatingStatusMessage = 'Actualizando un proyecto';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado un proyecto';
    this._createErrorMessage = 'Error al registrar un proyecto';
    this._updateSuccessMessage = 'Se ha actualizado un proyecto';
    this._updateErrorMessage = 'Error al actualizar un proyecto';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createSelectField({
        field: 'customerId',
        label: 'Cliente',
        placeholder: 'Cliente del proyecto',
        icon: 'person',
        loadOptions: this.loadCustomers(),
        selectionChange: () => of(),
        required: true,
      }),
      this.createTextField({
        field: 'name',
        label: 'Nombre',
        placeholder: 'Nombre del cliente',
        icon: 'inventory',
        maxLength: 500,
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('projectId'));
    }

    return signal(fields);
  }

  private loadCustomers(): Observable<WritableSignal<ISelectData[]>> {
    const param = new HttpParams().set('page', '0').set('size', '99999999');
    return this._http$
      .get<IResponse<IFindAllResponse<ICustomer>>>(
        `${environment.endpoint.projectsManagement.customers}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectData(response, {
            value: 'customerId',
            label: 'name',
          });

          return data;
        }),
        catchError((error) => {
          return this.catchError(error, 'Error al cargar los clientes');
        })
      );
  }

  protected override changeStatusSubmit(data: IProject): void {
    delete data.customerId;
    super.changeStatusSubmit(data);
  }

  protected override updateSubmit(
    data: IProject,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.customerId;
    super.updateSubmit(data, form, closeForm);
  }

  protected override OpenModalForEdit(configuration: IProject): void {
    configuration = {
      ...configuration,
      customerId: configuration.customerId,
    };

    this._dataForModalUpdate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'customerId') {
          field.formControl().disable();
          field.loadOptions = this.loadCustomers();
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }
}
