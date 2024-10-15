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
import { IConfiguration } from '../../settings/configurations/configuration.interface';
import { ILevel } from '../../settings/levels/level.interface';
import { ITechnologyItem } from '../../technologies/technology-items/technology-item.interface';
import { ITechnologyType } from '../../technologies/technology-types/technology-type.interface';
import { IDomainKnowledge } from '../domain-knowledge/domain-knowledge.interface';
import { IDomainKnowledgeLevel } from './domain-knowledge-level.interface';

@Component({
  selector: 'app-domain-knowledge-levels',
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
          width: 75%;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class DomainKnowledgeLevelsComponent extends GenericCrudComponent<IDomainKnowledgeLevel> {
  constructor() {
    super();
    this._menuService.title = 'Dominios de conocimiento por nivel';
    this.displayedColumns.set([
      { name: 'Dominio', field: 'domainKnowledge.domain' },
      { name: 'Nivel', field: 'level.name' },
      { name: 'Configuración', field: 'configurationLevel.name' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.assessments.domainKnowledgeLevels;
    this._searchBar$.disabled = true;
    this._searchBar$.placeholder = '';
    this._errorMessageLoad =
      'Error al cargar los datos de los dominios de conocimiento por nivel';
    this._titleForModal = {
      create: 'Registrar dominio de conocimiento por nivel',
      update: 'Actualizar dominio de conocimiento por nivel',
      delete: 'Eliminar dominio de conocimiento por nivel',
    };
    this._deletingInProgressMessage =
      'Eliminando un dominio de conocimiento por nivel';
    this._deleteSuccessMessage =
      'Se ha eliminado un dominio de conocimiento por nivel';
    this._deleteErrorMessage =
      'Error al eliminar un dominio de conocimiento por nivel';
    this._updatingStatusMessage =
      'Actualizando un dominio de conocimiento por nivel';
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
        label: 'Tipo de tecnología',
        type: TypeInput.SELECT,
        placeholder: 'Tipo de tecnología del dominio de conocimiento',
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
            message: 'El tipo de tecnología es requerido',
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
        selectionChange: this.loadDomainKnowledges.bind(this),
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
            message: 'La tecnología del dominio de conocimiento',
          },
        ],
      },
      {
        field: 'domainKnowledgeId',
        label: 'Dominio',
        type: TypeInput.SELECT,
        placeholder: 'Dominio del dominio de conocimiento',
        icon: 'domain_verification',
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
            message: 'El dominio del dominio de conocimiento es requerido',
          },
        ],
      },
      {
        field: 'configurationLevelId',
        label: 'Configuración',
        type: TypeInput.SELECT,
        placeholder: 'Configuración a usar en el dominio de conocimiento',
        icon: 'settings',
        loadOptions: this.loadConfigurations(),
        selectionChange: this.loadLevels.bind(this),
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message:
              'La configuración a usar en el dominio de conocimiento es requerida',
          },
        ],
      },
      {
        field: 'levelId',
        label: 'Nivel',
        type: TypeInput.SELECT,
        placeholder: 'Nivel del dominio de conocimiento',
        icon: 'altitude',
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
            message: 'El nivel del dominio de conocimiento es requerido',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'domainKnowledgeLevelId',
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
      form.get('domainKnowledgeId')?.setValue('');
      form.get('domainKnowledgeId')?.disable();
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

  private loadDomainKnowledges(
    technologyItem: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('domainKnowledgeId')?.setValue('');
      form.get('domainKnowledgeId')?.disable();
      return form;
    });
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '99999999')
      .set('filter', technologyItem);
    return this._http$
      .get<IResponse<IFindAllResponse<IDomainKnowledge>>>(
        `${environment.endpoint.assessments.domainKnowledge}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectDataForIDomainKnowledge(response);

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateDomainKnowledgeOptions(config, data);
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateDomainKnowledgeOptions(config, data);
            });
          }

          form?.update((form) => {
            form.get('domainKnowledgeId')?.enable();
            return form;
          });

          return data;
        }),
        catchError((error) => {
          this.showSnackBar(
            'Error al cargar los dominios de conocimiento',
            'error'
          );
          console.error(error);
          return of(signal([]));
        })
      );
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
        catchError((error) =>
          this.catchError(error, 'Error al cargar las configuraciones')
        )
      );
  }

  private loadLevels(
    technologyItem: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('levelId')?.setValue('');
      form.get('levelId')?.disable();
      return form;
    });
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '99999999')
      .set('filter', technologyItem);
    return this._http$
      .get<IResponse<IFindAllResponse<ILevel>>>(
        `${environment.endpoint.assessments.levels}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectDataForILevel(response);

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateLevelOptions(config, data);
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateLevelOptions(config, data);
            });
          }

          form?.update((form) => {
            form.get('levelId')?.enable();
            return form;
          });

          return data;
        }),
        catchError((error) => {
          this.showSnackBar('Error al cargar los niveles', 'error');
          console.error(error);
          return of(signal([]));
        })
      );
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

  private mapDataToISelectDataForIDomainKnowledge(
    response: IResponse<IFindAllResponse<IDomainKnowledge>>
  ): WritableSignal<ISelectData[]> {
    return signal(
      response.value.data.map(
        (domainKnowledge) =>
          ({
            value: domainKnowledge.domainKnowledgeId,
            label: domainKnowledge.domain,
          } as ISelectData)
      )
    );
  }

  private mapDataToISelectDataForILevel(
    response: IResponse<IFindAllResponse<ILevel>>
  ): WritableSignal<ISelectData[]> {
    return signal(
      response.value.data.map(
        (level) =>
          ({
            value: level.levelId,
            label: level.name,
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
    config: MatDialogConfig<IModalForForm<IDomainKnowledgeLevel>>,
    data: WritableSignal<ISelectData[]>
  ): MatDialogConfig<IModalForForm<IDomainKnowledgeLevel>> {
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

  private updateDomainKnowledgeOptions(
    config: MatDialogConfig<IModalForForm<IDomainKnowledgeLevel>>,
    data: WritableSignal<ISelectData[]>
  ): MatDialogConfig<IModalForForm<IDomainKnowledgeLevel>> {
    config.data?.form().find((field) => {
      if (field.field !== 'domainKnowledgeId') {
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

  private updateLevelOptions(
    config: MatDialogConfig<IModalForForm<IDomainKnowledgeLevel>>,
    data: WritableSignal<ISelectData[]>
  ): MatDialogConfig<IModalForForm<IDomainKnowledgeLevel>> {
    config.data?.form().find((field) => {
      if (field.field !== 'levelId') {
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

  protected override changeStatusSubmit(data: IDomainKnowledgeLevel): void {
    delete data.domainKnowledge;
    delete data.level;
    delete data.configurationLevel;
    super.changeStatusSubmit(data);
  }

  protected override createSubmit(
    config: IDomainKnowledgeLevel,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete config.technologyTypeId;
    delete config.technologyItemId;
    super.createSubmit(config, form, closeForm);
  }

  protected override updateSubmit(
    data: IDomainKnowledgeLevel,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.technologyTypeId;
    delete data.technologyItemId;
    super.updateSubmit(data, form, closeForm);
  }

  protected override OpenModalForEdit(
    configuration: IDomainKnowledgeLevel
  ): void {
    configuration = {
      ...configuration,
      technologyTypeId:
        configuration.domainKnowledge?.technologyItem?.technologyType
          ?.technologyTypeId,
      technologyItemId:
        configuration.domainKnowledge?.technologyItem?.technologyItemId,
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

        if (field.field === 'domainKnowledgeId') {
          field.formControl().enable();
          field.loadOptions = this.loadDomainKnowledges(
            configuration.technologyItemId ?? '',
            TypeForm.UPDATE
          );
        }

        if (field.field === 'levelId') {
          console.log('levelId', configuration.domainKnowledgeLevelId);
          field.formControl().enable();
          field.loadOptions = this.loadLevels(
            configuration.configurationLevelId ?? '',
            TypeForm.UPDATE
          );
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }
}
