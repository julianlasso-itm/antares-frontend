import { HttpParams } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectData } from '../../../components/form/select-data.interface';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  IModalForForm,
  TypeError,
  TypeForm,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { ITechnologyItem } from '../../technologies/technology-items/technology-item.interface';
import { ITechnologyType } from '../../technologies/technology-types/technology-type.interface';
import { IDomainKnowledge } from './domain-knowledge.interface';

@Component({
  selector: 'app-domain-knowledge',
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
export class DomainKnowledgeComponent extends GenericCrudComponent<IDomainKnowledge> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Dominio', field: 'domain' },
      { name: 'Peso', field: 'weight' },
      // { name: 'Tema', field: 'topic' },
      { name: 'Tecnología', field: 'technologyItem.name' },
      { name: 'Tipo', field: 'technologyItem.technologyType.name' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.assessments.domainKnowledge;
    this._searchBar$.placeholder = 'Buscar un dominio de conocimiento';
    this._errorMessageLoad =
      'Error al cargar los datos de los dominios de conocimiento';
    this._titleForModal = {
      create: 'Registrar un dominio de conocimiento',
      update: 'Actualizar un dominio de conocimiento',
      delete: 'Eliminar un dominio de conocimiento',
    };
    this._deletingInProgressMessage = 'Eliminando un dominio de conocimiento';
    this._deleteSuccessMessage = 'Se ha eliminado un dominio de conocimiento';
    this._deleteErrorMessage = 'Error al eliminar un dominio de conocimiento';
    this._updatingStatusMessage = 'Actualizando un dominio de conocimiento';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage =
      'Error al actualizar el dominio de conocimiento';
    this._createSuccessMessage = 'Se ha registrado un dominio de conocimiento';
    this._createErrorMessage = 'Error al registrar un dominio de conocimiento';
    this._updateSuccessMessage = 'Se ha actualizado un dominio de conocimiento';
    this._updateErrorMessage = 'Error al actualizar un dominio de conocimiento';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      {
        field: 'technologyTypeId',
        label: 'Tipo',
        type: TypeInput.SELECT,
        placeholder: 'Tipo del dominio de conocimiento',
        icon: 'auto_stories',
        loadOptions: this.loadTypes(),
        selectionChange: this.loadItems.bind(this),
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El tipo del dominio de conocimiento es requerido',
          },
        ],
      },
      {
        field: 'technologyItemId',
        label: 'Tecnología',
        type: TypeInput.SELECT,
        placeholder: 'Tecnología del dominio de conocimiento',
        icon: 'military_tech',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: () => of(),
        formControl: signal(
          new FormControl(
            {
              value: null,
              disabled: true,
            },
            {
              nonNullable: true,
              validators: [Validators.required],
            }
          )
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'La tecnología del dominio de conocimiento es requerida',
          },
        ],
      },
      {
        field: 'domain',
        label: 'Dominio',
        type: TypeInput.TEXT,
        placeholder: 'Dominio del dominio de conocimiento',
        icon: 'domain_verification',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(500)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El dominio del dominio de conocimiento es requerido',
          },
          {
            type: TypeError.MAX_LENGTH,
            message:
              'El dominio del dominio de conocimiento no debe exceder los 500 caracteres',
          },
        ],
      },
      {
        field: 'weight',
        label: 'Peso (importancia)',
        type: TypeInput.NUMBER,
        placeholder: 'Peso (importancia) del dominio de conocimiento',
        icon: 'weight',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(1),
            ],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El peso del dominio de conocimiento es requerido',
          },
          {
            type: TypeError.MIN,
            message:
              'El peso del dominio de conocimiento no debe ser menor que 0.00',
          },
          {
            type: TypeError.MAX,
            message:
              'El peso del dominio de conocimiento no debe ser mayor que 1.00',
          },
        ],
      },
      {
        field: 'topic',
        label: 'Tema',
        type: TypeInput.TEXT,
        placeholder: 'Tema del dominio de conocimiento',
        icon: 'topic',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(500)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El tema del dominio de conocimiento es requerido',
          },
          {
            type: TypeError.MAX_LENGTH,
            message:
              'El tema del dominio de conocimiento no debe exceder los 500 caracteres',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'domainKnowledgeId',
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

  private loadTypes(): Observable<WritableSignal<ISelectData[]>> {
    const param = new HttpParams().set('page', '0').set('size', '99999999');
    return this._http$
      .get<IResponse<IFindAllResponse<ITechnologyType>>>(
        `${environment.endpoint.technologies.types}`,
        param
      )
      .pipe(
        map(this.mapDataToISelectDataForITechnologyType),
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
          const data = this.mapDataToISelectDataForITechnologyItem(response);

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateTechnologyItemOptions(config, data);
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateTechnologyItemOptions(config, data);
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

  protected override createSubmit(
    config: IDomainKnowledge,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete config.technologyTypeId;
    super.createSubmit(config, form, closeForm);
  }

  protected override changeStatusSubmit(data: IDomainKnowledge): void {
    data = { ...data };
    delete (data as Partial<IDomainKnowledge>).technologyItem;
    super.changeStatusSubmit(data);
  }

  protected override OpenModalForEdit(configuration: IDomainKnowledge): void {
    configuration = {
      ...configuration,
      technologyTypeId:
        configuration.technologyItem?.technologyType?.technologyTypeId,
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

  protected override updateSubmit(
    data: IDomainKnowledge,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.technologyTypeId;
    super.updateSubmit(data, form, closeForm);
  }

  private mapDataToISelectDataForITechnologyType(
    response: IResponse<IFindAllResponse<ITechnologyType>>
  ): WritableSignal<ISelectData[]> {
    return signal(
      response.value.data.map(
        (technologyType) =>
          ({
            value: technologyType.technologyTypeId,
            label: technologyType.name,
          } as ISelectData)
      )
    );
  }

  private mapDataToISelectDataForITechnologyItem(
    response: IResponse<IFindAllResponse<ITechnologyItem>>
  ): WritableSignal<ISelectData[]> {
    return signal(
      response.value.data.map(
        (technologyItem) =>
          ({
            value: technologyItem.technologyItemId,
            label: technologyItem.name,
          } as ISelectData)
      )
    );
  }

  private updateTechnologyItemOptions(
    config: MatDialogConfig<IModalForForm<IDomainKnowledge>>,
    data: WritableSignal<ISelectData[]>
  ): MatDialogConfig<IModalForForm<IDomainKnowledge>> {
    config.data?.form().find((field) => {
      if (field.field !== 'technologyItemId') {
        return;
      }

      if (data().length > 0) {
        field.loadOptions = of(data);
        return;
      }

      field.loadOptions = of(signal([]));
    });
    return config;
  }
}
