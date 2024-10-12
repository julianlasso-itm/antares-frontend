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
import { ITechnologyType } from '../technology-types/technology-type.interface';
import { ITechnologyItem } from './technology-item.interface';

@Component({
  selector: 'app-technology-items',
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
          width: 65%;
          max-width: 100%;
        }
      }
    `,
  ],
})
export class TechnologyItemsComponent extends GenericCrudComponent<ITechnologyType> {
  constructor() {
    super();
    this.displayedColumns.set([
      { name: 'Nombre', field: 'name' },
      { name: 'Descripción', field: 'description' },
      // { name: 'Icono', field: 'icon' },
      { name: 'Tipo', field: 'technologyType.name' },
      { name: 'Estado', field: 'status' },
      { name: 'Acciones', field: 'actions' },
    ]);
    this._urlBackend = environment.endpoint.technologies.items;
    this._searchBar$.placeholder = 'Buscar un item de tecnología';
    this._errorMessageLoad =
      'Error al cargar los datos de los items de tecnologías';
    this._titleForModal = {
      create: 'Registrar un item de tecnología',
      update: 'Actualizar un item de tecnología',
      delete: 'Eliminar un item de tecnología',
    };
    this._deletingInProgressMessage = 'Eliminando un item de tecnología';
    this._deleteSuccessMessage = 'Se ha eliminado un item de tecnología';
    this._deleteErrorMessage = 'Error al eliminar un item de tecnología';
    this._updatingStatusMessage = 'Actualizando un item de tecnología';
    this._updatingStatusSuccessMessage =
      'Se ha actualizado el estado del registro';
    this._updatingStatusErrorMessage = 'Error al actualizar el estado';
    this._createSuccessMessage = 'Se ha registrado un item de tecnología';
    this._createErrorMessage = 'Error al registrar un item de tecnología';
    this._updateSuccessMessage = 'Se ha actualizado un item de tecnología';
    this._updateErrorMessage = 'Error al actualizar un item de tecnología';
  }

  protected override getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    const fields: FormField[] = [
      {
        field: 'name',
        label: 'Nombre',
        type: TypeInput.TEXT,
        placeholder: 'Nombre del item de tecnología',
        icon: 'military_tech',
        formControl: signal(
          new FormControl(null, {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(500)],
          })
        ),
        errors: [
          {
            type: TypeError.REQUIRED,
            message: 'El nombre del item de tecnología es requerido',
          },
          {
            type: TypeError.MAX_LENGTH,
            message:
              'El nombre del item de tecnología no debe exceder los 500 caracteres',
          },
        ],
      },
      {
        field: 'description',
        label: 'Descripción',
        type: TypeInput.TEXTAREA,
        placeholder: 'Descripción del item de tecnología',
        icon: 'description',
        formControl: signal(
          new FormControl(null, {
            validators: [Validators.maxLength(2048)],
          })
        ),
        errors: [
          {
            type: TypeError.MAX_LENGTH,
            message:
              'La descripción del item de tecnología no debe exceder los 2048 caracteres',
          },
        ],
      },
      {
        field: 'technologyTypeId',
        label: 'Tipo',
        type: TypeInput.SELECT,
        placeholder: 'Tipo del item de tecnología',
        icon: 'auto_stories',
        loadOptions: this.loadTypes(),
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
            message: 'El tipo de tecnología es requerido',
          },
        ],
      },
    ];

    if (withId) {
      fields.unshift({
        field: 'technologyItemId',
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

  private loadTypes(): Promise<WritableSignal<ISelectData[]>> {
    const param = new HttpParams().set('page', '0').set('size', '99999999');
    return lastValueFrom(
      this._http$
        .get<IResponse<IFindAllResponse<ITechnologyType>>>(
          `${environment.endpoint.technologies.types}`,
          param
        )
        .pipe(
          map((response) => {
            return signal(
              response.value.data.map(
                (technologyType) =>
                  ({
                    value: technologyType.technologyTypeId,
                    label: technologyType.name,
                  } as ISelectData)
              )
            );
          }),
          catchError((error) => {
            this.showSnackBar(
              'Error al cargar los tipos de tecnologías',
              'error'
            );
            console.error(error);
            return of(signal([]));
          })
        )
    );
  }

  protected override changeStatusSubmit(data: ITechnologyItem): void {
    delete data.technologyType;
    super.changeStatusSubmit(data);
  }
}
