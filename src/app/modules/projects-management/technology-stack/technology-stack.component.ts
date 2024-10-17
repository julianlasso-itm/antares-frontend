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
import { ITechnologyType } from '../../technologies/technology-types/technology-type.interface';
import { IProject } from '../projects/project.interface';
import { ITechnologyStack } from './technology-stack.interface';

@Component({
  selector: 'app-technology-stack',
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
export class TechnologyStackComponent extends GenericCrudComponent<ITechnologyStack> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Proyecto', field: 'project.name' },
      { name: 'Tecnología', field: 'technologyItem.name' },
      { name: 'Peso', field: 'weight' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.projectsManagement.technologyStack;
    this._searchBar$.placeholder =
      'Buscar una tecnología en un proyecto o un proyecto y sus tecnologías';
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
      this.createSelectField({
        field: 'technologyTypeId',
        label: 'Tipo de tecnología',
        placeholder: 'Tipo de tecnología',
        icon: 'auto_stories',
        loadOptions: this.loadTypes(),
        selectionChange: this.loadItems.bind(this),
        required: true,
      }),
      this.createSelectField({
        field: 'technologyItemId',
        label: 'Tecnología',
        placeholder: 'Tecnología',
        icon: 'military_tech',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: () => of(),
        required: true,
        disabled: true,
      }),
      this.createSelectField({
        field: 'projectId',
        label: 'Proyecto',
        placeholder: 'Proyecto a aplicar',
        icon: 'inventory',
        loadOptions: this.loadProjects(),
        selectionChange: () => of(),
        required: true,
      }),
      this.createNumberField({
        field: 'weight',
        label: 'Peso',
        placeholder: 'Peso de la tecnología en el stack tecnológico',
        icon: 'weight',
        options: {
          min: 0.0,
          max: 1.0,
          step: 0.01,
        },
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('technologyStackId'));
    }

    return signal(fields);
  }

  private loadTypes(): Observable<WritableSignal<ISelectData[]>> {
    const param = new HttpParams().set('page', '0').set('size', '99999999');
    return this._http$
      .get<IResponse<IFindAllResponse<ITechnologyType>>>(
        `${environment.endpoint.technologies.types}`,
        param
      )
      .pipe(
        map((response) => {
          return this.mapDataToISelectData(response, {
            value: 'technologyTypeId',
            label: 'name',
          });
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los tipos de tecnologías')
        )
      );
  }

  private loadItems(
    technologyType: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('technologyItemId')?.setValue('');
      form.get('technologyItemId')?.disable();
      return form;
    });
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '99999999')
      .set('filter', technologyType);
    return this._http$
      .get<IResponse<IFindAllResponse<ITechnologyItem>>>(
        `${environment.endpoint.technologies.items}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectData(response, {
            value: 'technologyItemId',
            label: 'name',
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
          this.catchError(error, 'Error al cargar los items de la tecnología')
        )
      );
  }

  private loadProjects(): Observable<WritableSignal<ISelectData[]>> {
    const param = new HttpParams().set('page', '0').set('size', '99999999');
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

          return data;
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los proyectos')
        )
      );
  }

  protected override createSubmit(
    config: ITechnologyStack,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete config.technologyTypeId;
    super.createSubmit(config, form, closeForm);
  }

  protected override updateSubmit(
    data: ITechnologyStack,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.technologyTypeId;
    super.updateSubmit(data, form, closeForm);
  }

  protected override changeStatusSubmit(data: ITechnologyStack): void {
    delete data.project;
    delete data.technologyItem;
    super.changeStatusSubmit(data);
  }

  protected override OpenModalForEdit(configuration: ITechnologyStack): void {
    configuration = {
      ...configuration,
      technologyTypeId:
        configuration.technologyItem?.technologyType.technologyTypeId,
    };

    this._dataForModalUpdate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'technologyItemId') {
          field.formControl().enable();
          field.loadOptions = this.loadItems(
            configuration.technologyTypeId ?? '',
            TypeForm.UPDATE
          );
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }
}
