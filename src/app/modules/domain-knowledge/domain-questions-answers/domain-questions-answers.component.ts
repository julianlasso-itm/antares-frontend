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
import { IDomainKnowledgeLevel } from '../domain-knowledge-levels/domain-knowledge-level.interface';
import { IDomainKnowledge } from '../domain-knowledge/domain-knowledge.interface';
import { IDomainQuestionsAnswer } from './domain-question-answer.interface';

@Component({
  selector: 'app-domain-questions-answers',
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
export class DomainQuestionsAnswersComponent extends GenericCrudComponent<IDomainQuestionsAnswer> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Dominio', field: 'domain' },
      { name: 'Nivel', field: 'domainKnowledgeLevel.level.name' },
      { name: 'Pregunta', field: 'question' },
      { name: 'Respuesta', field: 'answer' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.assessments.domainQuestionsAnswers;
    this._searchBar$.placeholder =
      'Buscar una pregunta o respuesta en los dominios de conocimiento';
    this._errorMessageLoad =
      'Error al cargar las preguntas y respuestas de los dominios de conocimiento';
    this._titleForModal = {
      create:
        'Registrar una pregunta y su respuesta en un dominio de conocimiento',
      update:
        'Actualizar una pregunta y su respuesta en un dominio de conocimiento',
      delete:
        'Eliminar una pregunta y su respuesta en un dominio de conocimiento',
    };
    this._deletingInProgressMessage =
      'Eliminando una pregunta y su respuesta en un dominio de conocimiento';
    this._deleteSuccessMessage =
      'Se ha eliminado una pregunta y su respuesta en un dominio de conocimiento';
    this._deleteErrorMessage =
      'Error al eliminar una pregunta y su respuesta en un dominio de conocimiento';
    this._updatingStatusMessage =
      'Actualizando una pregunta y su respuesta en un dominio de conocimiento';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage =
      'Error al actualizar una pregunta y su respuesta en un dominio de conocimiento';
    this._createSuccessMessage =
      'Se ha registrado una pregunta y su respuesta en un dominio de conocimiento';
    this._createErrorMessage =
      'Error al registrar una pregunta y su respuesta en un dominio de conocimiento';
    this._updateSuccessMessage =
      'Se ha actualizado una pregunta y su respuesta en un dominio de conocimiento';
    this._updateErrorMessage =
      'Error al actualizar una pregunta y su respuesta en un dominio de conocimiento';
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this._buttonHeader$.visibleAssistant = true;
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createSelectField({
        field: 'technologyTypeId',
        label: 'Tipo de tecnología',
        placeholder: 'Tipo de tecnología del dominio de conocimiento',
        icon: 'auto_stories',
        loadOptions: this.loadTypes(),
        selectionChange: this.loadItems.bind(this),
        required: true,
      }),
      this.createSelectField({
        field: 'technologyItemId',
        label: 'Tecnología',
        placeholder: 'Tecnología del dominio de conocimiento',
        icon: 'military_tech',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: this.loadDomainKnowledges.bind(this),
        required: true,
        disabled: true,
      }),
      this.createSelectField({
        field: 'domainKnowledgeId',
        label: 'Dominio',
        placeholder: 'Dominio del dominio de conocimiento',
        icon: 'domain_verification',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: this.level.bind(this),
        required: true,
        disabled: true,
      }),
      this.createSelectField({
        field: 'levelId',
        label: 'Nivel',
        placeholder: 'Nivel del dominio de conocimiento',
        icon: 'altitude',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: this.domainKnowledgeLevel.bind(this),
        required: false,
        disabled: true,
      }),
      this.createTextField({
        field: 'domainKnowledgeLevelId',
        label: 'combinación de niveles',
        placeholder: 'combinación de niveles',
        icon: 'altitude',
        maxLength: 500,
      }),
      this.createTextAreaField({
        field: 'question',
        label: 'Pregunta',
        placeholder: 'Pregunta del dominio de conocimiento',
        icon: 'question_mark',
        maxLength: 500,
        required: true,
      }),
      this.createTextAreaField({
        field: 'answer',
        label: 'Respuesta',
        placeholder: 'Respuesta del dominio de conocimiento',
        icon: 'chat',
        maxLength: 2048,
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('domainQuestionAnswerId'));
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
      form.get('technologyItemId')?.setValue(null);
      form.get('technologyItemId')?.disable();
      form.get('domainKnowledgeId')?.setValue(null);
      form.get('domainKnowledgeId')?.disable();
      form.get('levelId')?.setValue('');
      form.get('levelId')?.disable();
      form.get('domainKnowledgeLevelId')?.setValue(null);
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

  private loadDomainKnowledges(
    technologyItem: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('domainKnowledgeId')?.setValue(null);
      form.get('domainKnowledgeId')?.disable();
      form.get('levelId')?.setValue('');
      form.get('levelId')?.disable();
      form.get('domainKnowledgeLevelId')?.setValue(null);
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
          const data = this.mapDataToISelectData(response, {
            value: 'domainKnowledgeId',
            label: 'domain',
          });

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateOptions(config, data, 'domainKnowledgeId');
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateOptions(config, data, 'domainKnowledgeId');
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

  private level(
    technologyItem: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('levelId')?.setValue('');
      form.get('levelId')?.disable();
      form.get('domainKnowledgeLevelId')?.setValue(null);
      return form;
    });
    const param = new HttpParams()
      .set('page', '0')
      .set('size', '99999999')
      .set('filter', technologyItem);
    return this._http$
      .get<IResponse<IFindAllResponse<IDomainKnowledge>>>(
        `${environment.endpoint.assessments.domainKnowledgeLevels}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectData(
            response,
            {
              value: 'level.levelId',
              label: 'level.name',
            },
            { value: '', label: 'Ninguno' } as ISelectData
          );

          if (typeForm == TypeForm.UPDATE) {
            this._dataForModalUpdate.update((config) => {
              return this.updateOptions(config, data, 'levelId');
            });
          }

          if (typeForm === TypeForm.CREATE) {
            this._dataForModalCreate.update((config) => {
              return this.updateOptions(config, data, 'levelId');
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

  private domainKnowledgeLevel(
    levelId: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('domainKnowledgeLevelId')?.setValue('');
      return form;
    });

    if (levelId.length > 0) {
      let domainKnowledgeId = '';
      if (form) {
        domainKnowledgeId = form().get('domainKnowledgeId')?.value ?? '';
      }

      if (domainKnowledgeId === '') {
        return of(signal([]));
      }

      const param = new HttpParams()
        .set('level', levelId)
        .set('domainKnowledge', domainKnowledgeId);
      return this._http$
        .get<IResponse<IDomainKnowledgeLevel>>(
          `${environment.endpoint.assessments.findOne.domainKnowledgeLevels}`,
          param
        )
        .pipe(
          map((response) => {
            form?.update((form) => {
              form
                .get('domainKnowledgeLevelId')
                ?.setValue(response.value.domainKnowledgeLevelId);
              return form;
            });

            return of(signal([]));
          }),
          catchError((error) => {
            this.showSnackBar('Error al cargar los niveles', 'error');
            console.error(error);
            return of(signal([]));
          })
        ) as Observable<WritableSignal<ISelectData[]>>;
    }

    return of(signal([]));
  }

  protected override createSubmit(
    config: IDomainQuestionsAnswer,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete config.technologyTypeId;
    delete config.technologyItemId;
    delete config.levelId;
    super.createSubmit(config, form, closeForm);
  }

  protected override updateSubmit(
    data: IDomainQuestionsAnswer,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.technologyTypeId;
    delete data.technologyItemId;
    delete data.levelId;
    super.updateSubmit(data, form, closeForm);
  }

  protected override changeStatusSubmit(data: IDomainQuestionsAnswer): void {
    delete data.technologyTypeId;
    delete data.technologyItemId;
    delete data.levelId;
    delete data.domainKnowledgeId;
    delete data.domainKnowledgeLevelId;
    delete data.domainKnowledge;
    delete data.domainKnowledgeLevel;
    delete data.domain;
    super.changeStatusSubmit(data);
  }

  protected override OpenModalForEdit(
    configuration: IDomainQuestionsAnswer
  ): void {
    configuration = {
      ...configuration,

      domainQuestionAnswerId: configuration.domainQuestionAnswerId,

      technologyTypeId:
        configuration.domainKnowledgeLevel?.domainKnowledge.technologyItem
          .technologyType.technologyTypeId ??
        configuration.domainKnowledge?.technologyItem?.technologyType
          ?.technologyTypeId,

      technologyItemId:
        configuration.domainKnowledgeLevel?.domainKnowledge.technologyItem
          .technologyItemId ??
        configuration.domainKnowledge?.technologyItem?.technologyItemId,

      domainKnowledgeId:
        configuration.domainKnowledgeLevel?.domainKnowledge
          ?.domainKnowledgeId ?? configuration.domainKnowledgeId,

      levelId: configuration.domainKnowledgeLevel?.level?.levelId,
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
          field.formControl().enable();
          field.loadOptions = this.level(
            configuration.domainKnowledgeId ?? '',
            TypeForm.UPDATE
          );
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }
}
