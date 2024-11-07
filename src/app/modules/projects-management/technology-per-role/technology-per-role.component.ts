import { HttpParams } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectData } from '../../../components/form/select-data.interface';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  TypeForm,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { ITechnologyItem } from '../../technologies/technology-items/technology-item.interface';
import { ICustomer } from '../customers/customer.interface';
import { IProject } from '../projects/project.interface';
import { IRole } from '../roles/role.interface';
import { ITechnologyStack } from '../technology-stack/technology-stack.interface';
import { ITechnologyPerRole } from './technology-per-role.interface';

@Component({
  selector: 'app-technology-per-role',
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
          width: 100%;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class TechnologyPerRoleComponent extends GenericCrudComponent<ITechnologyPerRole> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Cliente', field: 'technologyStack.project.customer.name' },
      { name: 'Proyecto', field: 'technologyStack.project.name' },
      { name: 'Rol', field: 'role.name' },
      { name: 'Tecnología', field: 'technologyStack.technologyItem.name' },
      { name: 'Peso', field: 'technologyStack.weight' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend =
      environment.endpoint.projectsManagement.technologyPerRole;
    this._searchBar$.placeholder =
      'Buscar un rol en un proyecto y sus tecnologías';
    this._errorMessageLoad = 'Error al cargar los roles y sus tecnologías';
    this._titleForModal = {
      create: 'Registrar una tecnología en un rol de un proyecto',
      update: 'Actualizar una tecnología en un rol de un proyecto',
      delete: 'Eliminar una tecnología en un rol de un proyecto',
    };
    this._deletingInProgressMessage =
      'Eliminando una tecnología en un rol de un proyecto';
    this._deleteSuccessMessage =
      'Se ha eliminado una tecnología en un rol de un proyecto';
    this._deleteErrorMessage =
      'Error al eliminar una tecnología en un rol de un proyecto';
    this._updatingStatusMessage =
      'Actualizando una tecnología en un rol de un proyecto';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage =
      'Se ha registrado una tecnología en un rol de un proyecto';
    this._createErrorMessage =
      'Error al registrar una tecnología en un rol de un proyecto';
    this._updateSuccessMessage =
      'Se ha actualizado una tecnología en un rol de un proyecto';
    this._updateErrorMessage =
      'Error al actualizar una tecnología en un rol de un proyecto';
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
        selectionChange: this.loadProjects.bind(this),
        required: true,
      }),
      this.createSelectField({
        field: 'projectId',
        label: 'Proyecto',
        placeholder: 'Proyecto del rol',
        icon: 'inventory',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: this.loadTechnologyItems.bind(this),
        required: true,
        disabled: true,
      }),
      this.createSelectField({
        field: 'technologyItemId',
        label: 'Tecnología',
        placeholder: 'Tecnología',
        icon: 'military_tech',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: this.loadTechnologyStack.bind(this),
        required: true,
        disabled: true,
      }),
      this.createHiddenField('technologyStackId'),
      this.createSelectField({
        field: 'roleId',
        label: 'Rol',
        placeholder: 'Rol del proyecto',
        icon: 'verified_user',
        loadOptions: this.loadRoles(),
        selectionChange: () => of(),
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('technologyPerRoleId'));
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
          return this.mapDataToISelectData(response, {
            value: 'customerId',
            label: 'name',
          });
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los clientes')
        )
      );
  }

  private loadProjects(
    customerId: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('projectId')?.setValue('');
      form.get('projectId')?.disable();
      form.get('technologyItemId')?.setValue('');
      form.get('technologyItemId')?.disable();
      form.get('technologyStackId')?.setValue('');
      return form;
    });
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '99999999')
      .set('filter', customerId);
    return this._http$
      .get<IResponse<IFindAllResponse<IProject>>>(
        `${environment.endpoint.projectsManagement.projects}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectData(response, {
            value: 'projectId',
            label: 'name',
          });

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateOptions(config, data, 'projectId');
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateOptions(config, data, 'projectId');
            });
          }

          form?.update((form) => {
            form.get('projectId')?.enable();
            return form;
          });

          return data;
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los proyectos')
        )
      );
  }

  private loadRoles(): Observable<WritableSignal<ISelectData[]>> {
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '99999999')
      .set('withDisabled', false);
    return this._http$
      .get<IResponse<IFindAllResponse<IRole>>>(
        `${environment.endpoint.projectsManagement.roles}`,
        param
      )
      .pipe(
        map((response) => {
          return this.mapDataToISelectData(response, {
            value: 'roleId',
            label: 'name',
          });
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los roles')
        )
      );
  }

  private loadTechnologyItems(
    projectId: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('technologyItemId')?.setValue('');
      form.get('technologyItemId')?.disable();
      form.get('technologyStackId')?.setValue('');
      return form;
    });
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '99999999')
      .set('filter', projectId)
      .set('withDisabled', false);
    return this._http$
      .get<IResponse<IFindAllResponse<ITechnologyItem>>>(
        `${environment.endpoint.projectsManagement.technologyStack}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectData(response, {
            value: 'technologyItem.technologyItemId',
            label: 'technologyItem.name',
          });

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateOptions(config, data, 'technologyItemId');
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateOptions(config, data, 'technologyItemId');
            });
          }

          form?.update((form) => {
            form.get('technologyItemId')?.enable();
            return form;
          });

          return data;
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar las tecnologías')
        )
      );
  }
  private loadTechnologyStack(
    technologyItemIdOrProjectId: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    let technologyItemId = null;
    let projectId = null;

    if (form) {
      form.update((form) => {
        form.get('technologyStackId')?.setValue('');
        return form;
      });
      technologyItemId = form().get('technologyItemId')?.value ?? null;
      projectId = form().get('projectId')?.value ?? null;
    }

    const param = new HttpParams()
      .set('technologyItemId', technologyItemId)
      .set('projectId', projectId);

    return this._http$
      .get<IResponse<ITechnologyStack>>(
        `${environment.endpoint.projectsManagement.findOne.technologyStack}`,
        param
      )
      .pipe(
        map((response) => {
          form?.update((form) => {
            form
              .get('technologyStackId')
              ?.setValue(response.value.technologyStackId);
            return form;
          });

          return signal([]);
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar el stack tecnológico')
        )
      );
  }

  protected override changeStatusSubmit(data: ITechnologyPerRole): void {
    delete data.role;
    delete data.technologyStack;
    super.changeStatusSubmit(data);
  }

  protected override createSubmit(
    config: ITechnologyPerRole,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete config.customerId;
    delete config.projectId;
    delete config.technologyItemId;
    super.createSubmit(config, form, closeForm);
  }

  protected override updateSubmit(
    data: ITechnologyPerRole,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.customerId;
    delete data.projectId;
    delete data.technologyItemId;
    super.updateSubmit(data, form, closeForm);
  }

  protected override OpenModalForEdit(configuration: ITechnologyPerRole): void {
    configuration = {
      ...configuration,
      customerId: configuration.technologyStack?.project.customer.customerId,
      projectId: configuration.technologyStack?.project.projectId,
      technologyItemId:
        configuration.technologyStack?.technologyItem.technologyItemId,
    };

    this._dataForModalUpdate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'roleId') {
          field.formControl().enable();
          field.loadOptions = this.loadRoles();
        }

        if (field.field === 'projectId') {
          field.formControl().enable();
          field.loadOptions = this.loadProjects(
            configuration.customerId ?? '',
            TypeForm.UPDATE
          );
        }

        if (field.field === 'technologyItemId') {
          field.formControl().enable();
          field.loadOptions = this.loadTechnologyItems(
            configuration.projectId ?? '',
            TypeForm.UPDATE
          );
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }
}
