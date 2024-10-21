import { Component, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectData } from '../../../components/form/select-data.interface';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import { FormField } from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { DocumentType } from './document-type.enum';
import { IProfessional } from './professional.interface';

@Component({
  selector: 'app-professionals',
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
export class ProfessionalsComponent extends GenericCrudComponent<IProfessional> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Tipo de documento', field: 'documentType' },
      { name: 'Documento', field: 'document' },
      { name: 'Nombre', field: 'name' },
      { name: 'Correo', field: 'email' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.humanResources.professionals;
    this._searchBar$.placeholder = 'Buscar un profesional';
    this._errorMessageLoad = 'Error al cargar los datos de los profesionales';
    this._titleForModal = {
      create: 'Registrar un profesional',
      update: 'Actualizar un profesional',
      delete: 'Eliminar un profesional',
    };
    this._deletingInProgressMessage = 'Eliminando un profesional';
    this._deleteSuccessMessage = 'Se ha eliminado un profesional';
    this._deleteErrorMessage = 'Error al eliminar un profesional';
    this._updatingStatusMessage = 'Actualizando un profesional';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado un profesional';
    this._createErrorMessage = 'Error al registrar un profesional';
    this._updateSuccessMessage = 'Se ha actualizado un profesional';
    this._updateErrorMessage = 'Error al actualizar un profesional';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      this.createSelectField({
        field: 'documentType',
        label: 'Tipo de documento',
        placeholder: 'Tipo de documento',
        icon: 'fact_check',
        loadOptions: this.loadDocumentTypes(),
        selectionChange: this.enableDocument.bind(this),
        required: true,
      }),
      this.createNumberField({
        field: 'document',
        label: 'Documento',
        placeholder: 'Documento',
        icon: 'badge',
        required: true,
        disabled: true,
        options: {},
      }),
      this.createTextField({
        field: 'name',
        label: 'Nombre completo',
        placeholder: 'Nombre completo',
        icon: 'person',
        maxLength: 500,
        required: true,
      }),
      this.createTextField({
        field: 'email',
        label: 'Correo',
        placeholder: 'Correo',
        icon: 'email',
        maxLength: 500,
        required: true,
      }),
    ];

    if (withId) {
      fields.unshift(this.createHiddenField('professionalId'));
    }

    return signal(fields);
  }

  protected override changeStatusSubmit(data: IProfessional): void {
    delete data.documentType;
    delete data.document;
    super.changeStatusSubmit(data);
  }

  protected override updateSubmit(
    data: IProfessional,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    delete data.documentType;
    delete data.document;
    super.updateSubmit(data, form, closeForm);
  }

  protected override OpenModalForEdit(configuration: IProfessional): void {
    this._dataForModalUpdate.update((config) => {
      config.data?.form().find((field) => {
        if (field.field === 'documentType') {
          field.formControl().disable();
        }
      });
      return config;
    });

    super.OpenModalForEdit(configuration);
  }

  private loadDocumentTypes(): Observable<WritableSignal<ISelectData[]>> {
    const data = Object.values(DocumentType).map((type) => {
      return {
        value: type,
        label: type,
      };
    });
    return of(signal(data as ISelectData[]));
  }

  private enableDocument(
    documentType: string,
    typeForm: string,
    form?: WritableSignal<FormGroup>
  ): Observable<WritableSignal<ISelectData[]>> {
    form?.update((form) => {
      form.get('document')?.setValue('');
      form.get('document')?.enable();
      return form;
    });
    return of(signal([]));
  }
}
