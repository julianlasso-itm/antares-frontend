import { Component, Input, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment.development';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import { FormField } from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IKnowledgeGapNote } from './knowledge-gap-note.interface';

@Component({
  selector: 'app-knowledge-gap-notes',
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
export class KnowledgeGapNotesComponent extends GenericCrudComponent<IKnowledgeGapNote> {
  @Input() knowledgeGapId!: string;

  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Brecha', field: 'knowledgeGap.title' },
      { name: 'Seguimiento', field: 'observation' },
      { name: 'Fecha', field: 'createdAt' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    const transformer = [];
    transformer[2] = (value: IKnowledgeGapNote) => {
      return new Date(value.createdAt as string).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };
    this.transformers.set(transformer);
    this._urlBackend = environment.endpoint.knowledgeGaps.notes;
    this._searchBar$.placeholder = '';
    this._searchBar$.disabled = true;
    this._errorMessageLoad =
      'Error al cargar los datos de los seguimientos a las brechas de conocimiento';
    this._titleForModal = {
      create: 'Registrar un seguimiento a una brecha de conocimiento',
      update: 'Actualizar un seguimiento a una brecha de conocimiento',
      delete: 'Eliminar un seguimiento a una brecha de conocimiento',
    };
    this._deletingInProgressMessage =
      'Eliminando un seguimiento a una brecha de conocimiento';
    this._deleteSuccessMessage =
      'Se ha eliminado un seguimiento a una brecha de conocimiento';
    this._deleteErrorMessage =
      'Error al eliminar un seguimiento a una brecha de conocimiento';
    this._updatingStatusMessage =
      'Actualizando un seguimiento a una brecha de conocimiento';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage =
      'Se ha registrado un seguimiento a una brecha de conocimiento';
    this._createErrorMessage =
      'Error al registrar un seguimiento a una brecha de conocimiento';
    this._updateSuccessMessage =
      'Se ha actualizado un seguimiento a una brecha de conocimiento';
    this._updateErrorMessage =
      'Error al actualizar un seguimiento a una brecha de conocimiento';
  }

  override ngOnInit(): void {
    this._filter.set(this.knowledgeGapId);
    super.ngOnInit();
    this._menuService.title = 'Seguimiento de brechas de conocimiento';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createHiddenField('knowledgeGapId'),
      this.createTextAreaField({
        field: 'observation',
        label: 'Observación',
        placeholder: 'Observación',
        icon: 'description',
        maxLength: 8192,
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('knowledgeGapNoteId'));
    }

    return signal(fields);
  }

  protected override changeStatusSubmit(data: IKnowledgeGapNote): void {
    delete data.knowledgeGapId;
    delete data.userId;
    super.changeStatusSubmit(data);
  }

  protected override createSubmit(
    config: IKnowledgeGapNote,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    // delete config.knowledgeGapId;
    super.createSubmit(config, form, closeForm);
  }

  protected override updateSubmit(
    data: IKnowledgeGapNote,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.knowledgeGapId;
    super.updateSubmit(data, form, closeForm);
  }

  protected override OpenModalForEdit(configuration: IKnowledgeGapNote): void {
    this._dataForModalUpdate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'knowledgeGapId') {
          field.formControl().setValue(this.knowledgeGapId);
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }

  protected override OpenModalForCreate(): void {
    this._dataForModalCreate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'knowledgeGapId') {
          field.formControl().setValue(this.knowledgeGapId);
        }
      });
      return config;
    });

    super.OpenModalForCreate();
  }
}
