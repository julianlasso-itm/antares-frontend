import { HttpParams } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ISelectData } from '../../../components/form/select-data.interface';
import { GenericCrudComponent } from '../../../components/generic-crud/generic-crud.component';
import {
  FormField,
  TypeError,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { TableComponent } from '../../../components/table/table.component';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { IConfiguration } from '../configurations/configuration.interface';
import { ILevel } from '../levels/level.interface';
import { IConfigurationPerLevel } from './configuration-per-level.interface';

@Component({
  selector: 'app-configuration-per-level',
  standalone: true,
  imports: [MatProgressSpinnerModule, TableComponent],
  templateUrl: './configuration-per-level.component.html',
  styleUrl: './configuration-per-level.component.scss',
})
export class ConfigurationPerLevelComponent extends GenericCrudComponent<IConfigurationPerLevel> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Configuración', field: 'configurationLevel.name' },
      { name: 'Nivel', field: 'level.name' },
      { name: 'Posición', field: 'position' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.assessments.configurationPerLevel;
    // this._searchBar$.placeholder = '';
    this._searchBar$.disabled = true;
    this._errorMessageLoad =
      'Error al cargar los datos de la nivel por configuración';
    this._titleForModal = {
      create: 'Registrar nivel por configuración',
      update: 'Actualizar nivel por configuración',
      delete: 'Eliminar nivel por configuración',
    };
    this._deletingInProgressMessage = 'Eliminando el nivel por configuración';
    this._deleteSuccessMessage = 'Se ha eliminado un nivel por configuración';
    this._deleteErrorMessage = 'Error al eliminar un nivel por configuración';
    this._updatingStatusMessage = 'Actualizando el estado';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado un nivel por configuración';
    this._createErrorMessage = 'Error al registrar un nivel por configuración';
    this._updateSuccessMessage = 'Se ha actualizado un nivel por configuración';
    this._updateErrorMessage = 'Error al actualizar un nivel por configuración';
  }

  protected override onSearch(search: string): void {}

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      {
        field: 'configurationLevelId',
        label: 'Configuración',
        type: TypeInput.SELECT,
        placeholder: 'Nombre de la configuración',
        icon: 'settings',
        loadOptions: this.loadConfigurations(),
        selectionChange: () => {},
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El nombre de la configuración es requerido',
          },
        ],
      },
      {
        field: 'levelId',
        label: 'Nivel',
        type: TypeInput.SELECT,
        placeholder: 'Nombre del nivel',
        icon: 'altitude',
        loadOptions: this.loadLevels(),
        selectionChange: () => {},
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El nombre del nivel es requerido',
          },
        ],
      },
      {
        field: 'position',
        label: 'Posición',
        type: TypeInput.NUMBER,
        placeholder: 'Posición del nivel en la configuración',
        icon: 'stacks',
        formControl: signal(
          new FormControl(1, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'La posición del nivel es requerida',
          },
          {
            type: TypeError.MIN,
            message: 'La posición del nivel no debe ser menor que 1',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'configurationPerLevelId',
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

  private loadConfigurations(): Promise<WritableSignal<ISelectData[]>> {
    const param = new HttpParams().set('page', '0').set('size', '99999999');
    return lastValueFrom(
      this._http$
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
          catchError((error) => {
            this.showSnackBar('Error al cargar las configuraciones', 'error');
            console.error(error);
            return of(signal([]));
          })
        )
    );
  }

  private loadLevels(): Promise<WritableSignal<ISelectData[]>> {
    console.log('Cargando niveles');
    const param = new HttpParams().set('page', '0').set('size', '99999999');
    return lastValueFrom(
      this._http$
        .get<IResponse<IFindAllResponse<ILevel>>>(
          `${environment.endpoint.assessments.levels}`,
          param
        )
        .pipe(
          map((response) => {
            return signal(
              response.value.data.map(
                (level) =>
                  ({
                    value: level.levelId,
                    label: level.name,
                  } as ISelectData)
              )
            );
          }),
          catchError((error) => {
            this.showSnackBar('Error al cargar los niveles', 'error');
            console.error(error);
            return of(signal([]));
          })
        )
    );
  }

  protected override changeStatusSubmit(data: IConfigurationPerLevel): void {
    delete data.configurationLevel;
    delete data.level;
    super.changeStatusSubmit(data);
  }
}
