import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  TypeError,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { IAction } from '../../../components/table/action.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IConfiguration } from './configuration.interface';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [MatProgressSpinnerModule, TableComponent],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss',
})
export class ConfigurationsComponent extends GenericCrudComponent<IConfiguration> {
  private readonly _router = inject(Router);

  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.assessments.configurations;
    this._searchBar$.placeholder = 'Buscar una configuración';
    this._errorMessageLoad = 'Error al cargar los datos de las configuraciones';
    this._titleForModal = {
      create: 'Registrar configuración',
      update: 'Actualizar configuración',
      delete: 'Eliminar configuración',
    };
    this._deletingInProgressMessage = 'Eliminando la configuración';
    this._deleteSuccessMessage = 'Se ha eliminado la configuración';
    this._deleteErrorMessage = 'Error al eliminar la configuración';
    this._updatingStatusMessage = 'Actualizando el estado';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado la configuración';
    this._createErrorMessage = 'Error al registrar la configuración';
    this._updateSuccessMessage = 'Se ha actualizado la configuración';
    this._updateErrorMessage = 'Error al actualizar la configuración';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      {
        field: 'name',
        label: 'Nombre',
        type: TypeInput.TEXT,
        placeholder: 'Nombre de la configuración',
        icon: 'settings',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(50)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El nombre de la configuración es requerido',
          },
          {
            type: TypeError.MAX_LENGTH,
            message:
              'El nombre de la configuración no debe exceder los 50 caracteres',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'configurationLevelId',
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

  protected override getActions(entity: IConfiguration): IAction[] {
    const actions = super.getActions(entity);
    actions.push({
      icon: 'altitude',
      tooltip: 'Niveles',
      action: () => {
        this._router.navigate(['settings/levels', entity.configurationLevelId]);
      },
    });
    return actions;
  }
}
