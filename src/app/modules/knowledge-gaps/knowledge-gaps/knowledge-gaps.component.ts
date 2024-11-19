import { HttpParams } from '@angular/common/http';
import {
  Component,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ISelectData } from '../../../components/form/select-data.interface';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  TypeForm,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { IAction } from '../../../components/table/action.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IAssessment } from '../../assessments/assessments/assessment.interface';
import { IDomainKnowledge } from '../../domain-knowledge/domain-knowledge/domain-knowledge.interface';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { ItemByCompletedAssessment } from './item-by-completed-assessment.interface';
import { IKnowledgeGap } from './knowledge-gap.interface';

@Component({
  selector: 'app-knowledge-gaps',
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
export class KnowledgeGapsComponent extends GenericCrudComponent<IKnowledgeGap> {
  @Input() professionalId!: string;
  private readonly _assessmentId: WritableSignal<string>;
  private readonly _router = inject(Router);

  constructor() {
    super();
    this._assessmentId = signal('');
    this.displayedColumns.set([
      { name: 'Título', field: 'title' },
      { name: 'Observaciones', field: 'observation' },
      { name: 'Registrado', field: 'createdAt' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.knowledgeGaps.gaps;
    this._searchBar$.placeholder = 'Buscar una brecha de conocimiento';
    this._errorMessageLoad =
      'Error al cargar los datos de las brechas de conocimiento';
    this._titleForModal = {
      create: 'Registrar una brecha de conocimiento',
      update: 'Actualizar una brecha de conocimiento',
      delete: 'Eliminar una brecha de conocimiento',
    };
    this._deletingInProgressMessage = 'Eliminando una brecha de conocimiento';
    this._deleteSuccessMessage = 'Se ha eliminado una brecha de conocimiento';
    this._deleteErrorMessage = 'Error al eliminar una brecha de conocimiento';
    this._updatingStatusMessage = 'Actualizando una brecha de conocimiento';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado una brecha de conocimiento';
    this._createErrorMessage = 'Error al registrar una brecha de conocimiento';
    this._updateSuccessMessage = 'Se ha actualizado una brecha de conocimiento';
    this._updateErrorMessage = 'Error al actualizar una brecha de conocimiento';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createSelectField({
        field: 'assessmentId',
        label: 'Evaluación (fecha de finalización)',
        placeholder: 'Evaluación',
        icon: 'event',
        loadOptions: this.loadProfessionalCompletedAssessments(),
        selectionChange: this.loadTechnologyItem.bind(this),
        required: true,
      }),
      this.createSelectField({
        field: 'technologyItemId',
        label: 'Tecnología',
        placeholder: 'Tecnología',
        icon: 'military_tech',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: this.loadDomainKnowledges.bind(this),
        required: true,
        disabled: true,
      }),
      this.createSelectField({
        field: 'domainKnowledgeId',
        label: 'Dominio',
        placeholder: 'Dominio',
        icon: 'build',
        loadOptions: new Observable<WritableSignal<ISelectData[]>>(),
        selectionChange: () => of(),
        required: true,
        disabled: true,
      }),
      this.createTextField({
        field: 'title',
        label: 'Título',
        placeholder: 'Título',
        icon: 'title',
        maxLength: 500,
        required: true,
      }),
      this.createTextAreaField({
        field: 'observation',
        label: 'Observaciones',
        placeholder: 'Observaciones',
        icon: 'description',
        maxLength: 8192,
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('knowledgeGapId'));
    }

    return signal(fields);
  }

  override ngOnInit(): void {
    this._filter.set(this.professionalId);
    super.ngOnInit();
    this._menuService.title = 'Brechas de conocimiento';
    const transformers = [];
    transformers[2] = (element: IKnowledgeGap) => {
      return new Date(element.createdAt as string).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };
    this.transformers.set(transformers);
  }

  private loadProfessionalCompletedAssessments(): Observable<
    WritableSignal<ISelectData[]>
  > {
    this._assessmentId.set('');
    return this._http$
      .get<IResponse<IFindAllResponse<IAssessment>>>(
        `${environment.endpoint.assessments.getProfessionalCompletedAssessments}/${this.professionalId}`
      )
      .pipe(
        map((response) => {
          return this.mapDataToISelectData(response, {
            value: 'assessmentId',
            label: 'endDate',
            transformer: (endDate: string, type: IAssessment) => {
              return `${new Date(endDate).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })} - ${type.rolePerProfessional.role.name}`;
            },
          });
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar las evaluaciones')
        )
      );
  }

  private loadTechnologyItem(
    assessmentId: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    this._assessmentId.set(assessmentId);
    form?.update((form) => {
      form.get('technologyItemId')?.setValue('');
      form.get('technologyItemId')?.disable();
      form.get('domainKnowledgeId')?.setValue('');
      form.get('domainKnowledgeId')?.disable();
      return form;
    });
    return this._http$
      .get<IResponse<ItemByCompletedAssessment[]>>(
        `${environment.endpoint.technologies.itemsByCompletedAssessment}/${assessmentId}`
      )
      .pipe(
        map((response) => {
          console.log('response', response);
          const data = this.mapDataToISelectData(response, {
            value: 'technologyItemId',
            label: 'name',
          });

          let dataForModal = this._dataForModalCreate;

          if (typeForm == TypeForm.UPDATE) {
            dataForModal = this._dataForModalUpdate;
          }

          dataForModal.update((config) => {
            return this.updateOptions(config, data, 'technologyItemId');
          });

          form?.update((form) => {
            form.get('technologyItemId')?.enable();
            return form;
          });

          return data;
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar las brechas de conocimiento')
        )
      );
  }

  private loadDomainKnowledges(
    technologyItemId: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('domainKnowledgeId')?.setValue('');
      form.get('domainKnowledgeId')?.disable();
      return form;
    });
    const param = new HttpParams().set('technologyItemId', technologyItemId);
    return this._http$
      .get<IResponse<IFindAllResponse<IDomainKnowledge>>>(
        `${
          environment.endpoint.assessments.domainKnowledgeByCompletedAssessment
        }/${this._assessmentId()}`,
        param
      )
      .pipe(
        map((response) => {
          const data = this.mapDataToISelectData(response, {
            value: 'domainKnowledgeId',
            label: 'domain',
          });

          let dataForModal = this._dataForModalCreate;

          if (typeForm == TypeForm.UPDATE) {
            dataForModal = this._dataForModalUpdate;
          }

          dataForModal.update((config) => {
            return this.updateOptions(config, data, 'domainKnowledgeId');
          });

          form?.update((form) => {
            form.get('domainKnowledgeId')?.enable();
            return form;
          });

          return data;
        }),
        catchError((error) =>
          this.catchError(error, 'Error al cargar los dominios de conocimiento')
        )
      );
  }

  protected override createSubmit(
    config: IKnowledgeGap,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete config.technologyItemId;
    super.createSubmit(config, form, closeForm);
  }

  protected override updateSubmit(
    data: IKnowledgeGap,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    super.updateSubmit(data, form, closeForm);
  }

  protected override changeStatusSubmit(data: IKnowledgeGap): void {
    delete data.assessmentId;
    delete data.domainKnowledgeId;
    delete data.assessment;
    super.changeStatusSubmit(data);
  }

  protected override OpenModalForEdit(configuration: IKnowledgeGap): void {
    configuration = {
      ...configuration,
      assessmentId: configuration.assessmentId,
      domainKnowledgeId: configuration.domainKnowledgeId,
    };

    this._dataForModalUpdate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'assessmentId') {
          field.formControl().disable();
          // field.loadOptions = this.loadProfessionalCompletedAssessments();
        }

        if (field.field === 'technologyItemId') {
          field.formControl().disable();
          // field.loadOptions = this.loadTechnologyItem(
          //   configuration.assessmentId ?? '',
          //   TypeForm.UPDATE,
          // );
        }

        if (field.field === 'domainKnowledgeId') {
          field.formControl().disable();
          // field.loadOptions = this.loadDomainKnowledges(
          //   configuration.technologyItemId ?? '',
          //   TypeForm.UPDATE
          // );
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }

  protected override getActions(entity: IKnowledgeGap): IAction[] {
    const actions = super.getActions(entity);
    actions.push({
      icon: 'checklist',
      tooltip: 'Seguimiento de brecha',
      action: () => {
        this._router.navigate(['knowledge-gaps/notes', entity.knowledgeGapId]);
      },
    });
    return actions;
  }
}
