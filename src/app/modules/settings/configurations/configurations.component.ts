import { HttpParams } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DeleteModalComponent } from '../../../components/delete-modal/delete-modal.component';
import { ModalForFormComponent } from '../../../components/modal-for-form/modal-for-form.component';
import {
  FormField,
  IModalForForm,
  TypeError,
  TypeForm,
  TypeInput,
} from '../../../components/modal-for-form/modal-for-form.interface';
import { IAction } from '../../../components/table/action.interface';
import { Paginator } from '../../../components/table/paginator.class';
import { TableComponent } from '../../../components/table/table.component';
import { ButtonAddService } from '../../../services/button-add.service';
import { GlobalProgressBarService } from '../../../services/global-progress-bar.service';
import { HttpService } from '../../../services/http.service';
import { OperationBackendService } from '../../../services/operation-backend.service';
import { SearchBarService } from '../../../services/search-bar.service';
import { IFindAllResponse, IResponse } from '../../response.interface';
import { IConfiguration } from './configuration.interface';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatSnackBarModule, TableComponent],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss',
})
export class ConfigurationsComponent {
  dataSource: WritableSignal<IConfiguration[]>;
  displayedColumns = signal([
    { name: 'Nombre', field: 'name' },
    { name: 'Estado', field: 'status' },
    { name: 'Acciones', field: 'actions' },
  ]);
  private _searchBarSubscription: Subscription;
  private readonly _buttonAddService = inject(ButtonAddService);
  private readonly _dialog = inject(MatDialog);
  private readonly _globalProgressBarService = inject(GlobalProgressBarService);
  private readonly _httpService = inject(HttpService);
  private readonly _numberOfSearches: WritableSignal<number>;
  private readonly _operationBackendService = inject(OperationBackendService);
  private readonly _searchBarService = inject(SearchBarService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _urlCustomers = '/assessments/configuration-levels';
  readonly loading: WritableSignal<boolean>;
  readonly paginator: WritableSignal<Paginator>;

  constructor() {
    this.paginator = signal(new Paginator());
    this.loading = signal(false);
    this.dataSource = signal([]);
    this._searchBarSubscription = new Subscription();
    this._numberOfSearches = signal(0);
  }

  ngOnInit(): void {
    this._buttonAddService.visible = true;
    this._buttonAddService.action =
      this.OpenModalForCreateConfiguration.bind(this);
    this.getDataSource();
    this._searchBarService.placeholder = 'Buscar una configuración';
    this._searchBarSubscription = this._searchBarService.search$.subscribe({
      next: (search) => this.onSearch(search),
    });
  }

  ngOnDestroy(): void {
    this._searchBarSubscription.unsubscribe();
  }

  /**
   * Método para obtener los datos de la tabla en función del evento de paginación
   * @param event - Evento de paginación
   */
  pageEvent(event: PageEvent) {
    this.paginator.update((paginator) => {
      paginator.pageIndex = event.pageIndex;
      paginator.pageSize = event.pageSize;
      return paginator;
    });
    this.getDataSource();
  }

  /**
   * Método para buscar registros en la tabla
   * @param search - Texto a buscar
   */
  private onSearch(search: string): void {
    if (search.length === 0 && this._numberOfSearches() > 0) {
      this.getDataSource();
    } else if (search.length > 0) {
      this.loading.set(true);
      const params = new HttpParams()
        .set('page', '0')
        .set('size', this.paginator().pageSize.toString())
        .set('search', search);

      this._httpService
        .get<IResponse<IFindAllResponse<IConfiguration>>>(
          this._urlCustomers,
          params
        )
        .subscribe({
          next: (response) => {
            response.value.data.forEach((configuration) => {
              configuration.actions = this.getActions(configuration);
            });
            this.paginator.update((paginator) => {
              paginator.length = response.value.total;
              return paginator;
            });
            this.dataSource.set(response.value.data);
          },
          error: (error) => {
            this._snackBar.open(
              'Error al cargar los datos de las configuraciones',
              'Cerrar',
              {
                duration: 10000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: 'custom-snack-bar',
              }
            );
            console.error(error);
            this.loading.set(false);
          },
          complete: () => {
            this.loading.set(false);
          },
        });
      this._numberOfSearches.set(this._numberOfSearches() + 1);
    }
  }

  /**
   * Método para generar la configuración del modal
   * @param data - Datos del formulario
   * @param typeForm - Tipo de formulario
   * @returns Configuración del modal
   */
  private generateModalInfo(
    data: WritableSignal<IConfiguration>,
    typeForm: TypeForm
  ): MatDialogConfig<IModalForForm<IConfiguration>> {
    return {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: {
        title: 'Registrar configuración',
        submit:
          typeForm === TypeForm.CREATE
            ? this.createConfigurationSubmit.bind(this)
            : this.updateConfigurationSubmit.bind(this),
        action: typeForm === TypeForm.CREATE ? 'Registrar' : 'Actualizar',
        form: this.getFieldsInfo(typeForm !== TypeForm.CREATE),
        data,
        typeForm,
      },
    };
  }

  /**
   * Método para obtener los datos de la tabla
   */
  private getDataSource(): void {
    this.loading.set(true);
    const params = new HttpParams()
      .set('page', this.paginator().pageIndex.toString())
      .set('size', this.paginator().pageSize.toString());
    this._httpService
      .get<IResponse<IFindAllResponse<IConfiguration>>>(
        this._urlCustomers,
        params
      )
      .subscribe({
        next: (response) => {
          response.value.data.forEach((configuration) => {
            configuration.actions = this.getActions(configuration);
          });
          this.paginator.update((paginator) => {
            paginator.length = response.value.total;
            return paginator;
          });
          this.dataSource.set(response.value.data);
        },
        error: (error) => {
          this._snackBar.open(
            'Error al cargar los datos de las configuraciones',
            'Cerrar',
            {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: 'custom-snack-bar',
            }
          );
          console.error(error);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
          console.log('Complete', this.paginator());
        },
      });
  }

  /**
   * Método para obtener las acciones de un registro de configuración
   * @param configuration - Objeto de configuración
   * @returns Acciones
   */
  private getActions(configuration: IConfiguration): IAction[] {
    return [
      {
        icon: 'detector_status',
        tooltip: 'Estado',
        action: this.changeStatusSubmit.bind(this, configuration),
      },
      {
        icon: 'groups',
        tooltip: 'Niveles',
        action: () => {
          console.log('Niveles', configuration.configurationLevelId);
        },
      },
      {
        icon: 'linear_scale',
        tooltip: 'Escala de calificación',
        action: () => {
          console.log(
            'Escala de calificación',
            configuration.configurationLevelId
          );
        },
      },
      {
        icon: 'edit',
        tooltip: 'Editar',
        action: this.OpenModalForEditConfiguration.bind(this, configuration),
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar',
        action: this.OpenModalForDeleteConfiguration.bind(this, configuration),
      },
    ];
  }

  /**
   * Método para abrir el modal para crear una nueva configuración
   */
  OpenModalForCreateConfiguration(): void {
    this._dialog.open(
      ModalForFormComponent,
      this.generateModalInfo(signal({} as IConfiguration), TypeForm.CREATE)
    );
  }

  /**
   * Método para abrir el modal para editar una configuración
   * @param configuration - Registro de configuración a editar
   */
  OpenModalForEditConfiguration(configuration: IConfiguration): void {
    // const updateConfiguration = { ...configuration };
    // delete updateConfiguration.actions;
    this._dialog.open(
      ModalForFormComponent,
      this.generateModalInfo(signal(configuration), TypeForm.UPDATE)
    );
  }

  OpenModalForDeleteConfiguration(configuration: IConfiguration): void {
    const dialogRef = this._dialog.open(DeleteModalComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        id: configuration.configurationLevelId,
        name: configuration.name,
      },
    });

    dialogRef.afterClosed().subscribe((id) => {
      if (id) {
        this._globalProgressBarService.visible = true;
        this._snackBar.open('Eliminando la configuración', 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'custom-snack-bar',
        });
        this._httpService
          .delete<IResponse<IConfiguration>>(`${this._urlCustomers}/${id}`)
          .subscribe({
            next: () => {
              this._snackBar.open(
                `Se ha eliminado la configuración "${configuration.name}"`,
                'Cerrar',
                {
                  duration: 10000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass: 'custom-snack-bar',
                }
              );
              this.getDataSource();
            },
            error: (error) => {
              this._globalProgressBarService.visible = false;
              this._snackBar.open(
                'Error al eliminar la configuración',
                'Cerrar',
                {
                  duration: 10000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass: 'custom-snack-bar',
                }
              );
              console.error(error);
            },
            complete: () => {
              this._globalProgressBarService.visible = false;
            },
          });
      }
    });
  }

  /**
   * Método para actualizar el estado de una configuración
   * @param data - Datos del formulario
   */
  private changeStatusSubmit(data: IConfiguration): void {
    const id = data.configurationLevelId;
    data.status = !data.status;
    delete data.actions;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;
    delete data.configurationLevelId;
    this._globalProgressBarService.visible = true;
    this._snackBar.open('Actualizando el estado', 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snack-bar',
    });
    this._httpService
      .put<IConfiguration, IResponse<IConfiguration>>(
        `${this._urlCustomers}/${id}`,
        data
      )
      .subscribe({
        next: (response) => {
          this._snackBar.open(
            `Se ha actualizado el estado de "${response.value.name}"`,
            'Cerrar',
            {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: 'custom-snack-bar',
            }
          );
          this.getDataSource();
        },
        error: (error) => {
          this._globalProgressBarService.visible = false;
          this._snackBar.open('Error al actualizar el estado', 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'custom-snack-bar',
          });
          console.error(error);
        },
        complete: () => {
          this._globalProgressBarService.visible = false;
        },
      });
  }

  /**
   * Método para registrar una nueva configuración en el back-end
   * @param config - Datos del formulario
   */
  private createConfigurationSubmit(
    config: IConfiguration,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    form.update((form) => {
      form.disable();
      return form;
    });
    this._operationBackendService.visible = true;
    this._httpService
      .post<IConfiguration, IResponse<IConfiguration>>(
        this._urlCustomers,
        config
      )
      .subscribe({
        next: (response) => {
          this._snackBar.open('Se ha registrado la configuración', 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'custom-snack-bar',
          });
          closeForm();
          this.getDataSource();
        },
        error: (error) => {
          this._snackBar.open('Error al registrar la configuración', 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'custom-snack-bar',
          });
          console.error(error);
          form.update((form) => {
            form.enable();
            return form;
          });
        },
        complete: () => {
          form.update((form) => {
            form.enable();
            form.reset();
            return form;
          });
          this._operationBackendService.visible = false;
        },
      });
  }

  /**
   * Método para actualizar una configuración en el back-end
   * @param config - Datos del formulario
   * @param form - Formulario
   * @param closeForm - Función para cerrar el formulario
   */
  private updateConfigurationSubmit(
    config: IConfiguration,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    const id = config.configurationLevelId;
    delete config.configurationLevelId;
    this._httpService
      .put<IConfiguration, IResponse<IConfiguration>>(
        `${this._urlCustomers}/${id}`,
        config
      )
      .subscribe({
        next: (response) => {
          this._snackBar.open(
            `Se ha actualizado la configuración "${response.value.name}"`,
            'Cerrar',
            {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: 'custom-snack-bar',
            }
          );
          closeForm();
          this.getDataSource();
        },
        error: (error) => {
          this._snackBar.open(
            'Error al actualizar la configuración',
            'Cerrar',
            {
              duration: 10000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: 'custom-snack-bar',
            }
          );
          console.error(error);
          form.update((form) => {
            form.enable();
            return form;
          });
        },
        complete: () => {
          form.update((form) => {
            form.enable();
            form.reset();
            return form;
          });
          this._operationBackendService.visible = false;
        },
      });
  }

  /**
   * Método para obtener la configuración de los campos del formulario
   * @returns Configuración de los campos del formulario
   */
  private getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<Array<FormField>> {
    const id = {
      field: 'configurationLevelId',
      type: TypeInput.HIDDEN,
      formControl: signal(
        new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required],
        })
      ),
    };
    return signal([
      ...(withId ? [id] : []),
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
    ]);
  }
}
