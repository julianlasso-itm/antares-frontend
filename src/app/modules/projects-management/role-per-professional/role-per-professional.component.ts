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
import { IProfessional } from '../../human-resources/professionals/professional.interface';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { ICustomer } from '../customers/customer.interface';
import { IProject } from '../projects/project.interface';
import { IRole } from '../roles/role.interface';
import { IRolePerProfessional } from './role-per-professional.interface';

@Component({
  selector: 'app-role-per-professional',
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
export class RolePerProfessionalComponent extends GenericCrudComponent<IRolePerProfessional> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Profesional', field: 'professional.name' },
      { name: 'Rol', field: 'role.name' },
      { name: 'Fecha de inicio', field: 'startDate' },
      { name: 'Fecha de finalización', field: 'endDate' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend =
      environment.endpoint.projectsManagement.rolePerProfessional;
    this._searchBar$.placeholder =
      'Buscar un profesional y sus roles o un rol y sus profesionales de un proyecto';
    this._errorMessageLoad = 'Error al cargar los profesionales y sus roles';
    this._titleForModal = {
      create: 'Registrar un profesional y su rol en un proyecto',
      update: 'Actualizar un profesional y su rol en un proyecto',
      delete: 'Eliminar un profesional y su rol en un proyecto',
    };
    this._deletingInProgressMessage =
      'Eliminando un profesional y su rol de un proyecto';
    this._deleteSuccessMessage =
      'Se ha eliminado un profesional y su rol de un proyecto';
    this._deleteErrorMessage =
      'Error al eliminar un profesional y su rol de un proyecto';
    this._updatingStatusMessage = 'Actualizando un profesional y su rol';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage =
      'Se ha registrado un profesional y su rol en un proyecto';
    this._createErrorMessage =
      'Error al registrar un profesional y su rol en un proyecto';
    this._updateSuccessMessage =
      'Se ha actualizado un profesional y su rol en un proyecto';
    this._updateErrorMessage =
      'Error al actualizar un profesional y su rol en un proyecto';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createSelectField({
        field: 'customerId',
        label: 'Cliente',
        placeholder: 'Cliente del proyecto',
        icon: 'guardian',
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
        selectionChange: this.loadRolesByProject.bind(this),
        required: true,
        disabled: true,
      }),
      this.createSelectField({
        field: 'roleId',
        label: 'Rol',
        placeholder: 'Rol del profesional',
        icon: 'verified_user',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: () => of(),
        required: true,
        disabled: true,
      }),
      this.createAutocompleteField({
        field: 'professionalId',
        label: 'Profesional',
        placeholder: 'Profesional del proyecto',
        icon: 'person',
        autocompleteOptions: this.loadProfessionals.bind(this),
        required: true,
        disabled: true,
      }),
      this.createDateField({
        field: 'startDate',
        label: 'Fecha de inicio',
        placeholder: 'Fecha de inicio',
        icon: 'event_available',
        required: true,
      }),
      this.createDateField({
        field: 'endDate',
        label: 'Fecha de finalización',
        placeholder: 'Fecha de finalización',
        icon: 'event_busy',
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('rolePerProfessionalId'));
    }

    return signal(fields);
  }

  protected override changeStatusSubmit(data: IRolePerProfessional): void {
    delete data.role;
    delete data.professional;
    data.startDate = new Date(data.startDate).toISOString();
    if (data.endDate) {
      const endDate = new Date(data.endDate);
      endDate.setHours(23, 59, 59, 999);
      data.endDate = endDate.toISOString();
    }
    super.changeStatusSubmit(data);
  }

  protected override createSubmit(
    config: IRolePerProfessional,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    console.log('config', `${config.startDate}`);
    delete config.customerId;
    delete config.projectId;
    if (typeof config.professionalId === 'object') {
      config.professionalId = config.professionalId.value;
    }

    const startDate = new Date(config.startDate);
    startDate.setHours(0, 0, 0, 0);
    config.startDate = startDate.toISOString();

    if (config.endDate) {
      const endDate = new Date(config.endDate);
      endDate.setHours(23, 59, 59, 999);
      config.endDate = endDate.toISOString();
    }

    super.createSubmit(config, form, closeForm);
  }

  protected override updateSubmit(
    data: IRolePerProfessional,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.customerId;
    delete data.projectId;
    if (typeof data.professionalId === 'object') {
      data.professionalId = data.professionalId.value;
    }
    super.updateSubmit(data, form, closeForm);
  }

  protected override OpenModalForEdit(
    configuration: IRolePerProfessional
  ): void {
    configuration = {
      ...configuration,
      customerId:
        configuration.role?.technologyPerRoles[0].technologyStack.project
          .customer.customerId,
      projectId:
        configuration.role?.technologyPerRoles[0].technologyStack.project
          .projectId,
      professionalId: {
        value: configuration.professional?.professionalId ?? '',
        label: configuration.professional?.name ?? '',
      },
      roleId: configuration.role?.roleId ?? '',
    };

    this._dataForModalUpdate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'customerId') {
          field.formControl().enable();
          field.loadOptions = this.loadCustomers();
        }
      });

      config.data?.form().find((field) => {
        if (field.field === 'projectId') {
          field.formControl().enable();
          field.loadOptions = this.loadProjects(
            configuration.customerId ?? '',
            TypeForm.UPDATE
          );
        }
      });

      config.data?.form().find((field) => {
        if (field.field === 'professionalId') {
          console.log('professionalId', field.formControl().value);
          console.log('professionalId', field.formControl());
          field.formControl().enable();
          field.loadOptions = this.loadProfessionals(
            configuration.projectId ?? '',
            TypeForm.UPDATE
          );
        }

        if (field.field === 'roleId') {
          field.formControl().enable();
          field.loadOptions = this.loadRolesByProject(
            configuration.projectId ?? '',
            TypeForm.UPDATE
          );
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
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
      form.get('roleId')?.setValue('');
      form.get('roleId')?.disable();
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

  private loadRolesByProject(
    projectId: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('roleId')?.setValue('');
      form.get('roleId')?.disable();
      return form;
    });
    const param = new HttpParams().set('projectId', projectId);
    return this._http$
      .get<IResponse<IFindAllResponse<IRole>>>(
        `${environment.endpoint.projectsManagement.technologyPerRole}/find-only-roles-by-project`,
        param
      )
      .pipe(
        map((response) => {
          console.log('response - roles by project', response);
          const data = this.mapDataToISelectData(response, {
            value: 'roleId',
            label: 'name',
          });

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateOptions(config, data, 'roleId');
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateOptions(config, data, 'roleId');
            });
          }

          form?.update((form) => {
            form.get('roleId')?.enable();
            return form;
          });

          return data;
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los roles')
        )
      );
  }

  private loadProfessionals(
    search: string,
    typeForm: string
  ): Observable<WritableSignal<ISelectData[]>> {
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '5')
      .set('search', search);
    return this._http$
      .get<IResponse<IFindAllResponse<IProfessional>>>(
        `${environment.endpoint.humanResources.professionals}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectData(response, {
            value: 'professionalId',
            label: 'name',
          });

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateOptions(config, data, 'professionalId');
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateOptions(config, data, 'professionalId');
            });
          }

          return data;
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los profesionales')
        )
      );
  }
}
