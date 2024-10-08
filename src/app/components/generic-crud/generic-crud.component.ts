import { HttpParams } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { IFindAllResponse, IResponse } from '../../modules/response.interface';
import { ButtonAddService } from '../../services/button-add.service';
import { GlobalProgressBarService } from '../../services/global-progress-bar.service';
import { HttpService } from '../../services/http.service';
import { OperationBackendService } from '../../services/operation-backend.service';
import { SearchBarService } from '../../services/search-bar.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { ModalForFormComponent } from '../modal-for-form/modal-for-form.component';
import {
  FormField,
  IModalForForm,
  TypeForm,
} from '../modal-for-form/modal-for-form.interface';
import { IAction } from '../table/action.interface';
import { Paginator } from '../table/paginator.class';
import { IEntity } from './entity.interface';
import { IDisplayedColumn } from '../table/displayed-columns.interface';

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [],
  template: '',
})
export class GenericCrudComponent<Entity extends IEntity> {
  protected _searchBarSubscription: Subscription;
  protected readonly _buttonAdd$ = inject(ButtonAddService);
  protected readonly _dialog = inject(MatDialog);
  protected readonly _globalProgressBar$ = inject(GlobalProgressBarService);
  protected readonly _http$ = inject(HttpService);
  protected readonly _numberOfSearches: WritableSignal<number>;
  protected readonly _operationBackend$ = inject(OperationBackendService);
  protected readonly _searchBar$ = inject(SearchBarService);
  protected readonly _snackBar = inject(MatSnackBar);
  protected _urlBackend: string;
  protected _errorMessageLoad: string;
  protected _titleForModal: { create: string; update: string; delete: string };
  protected _deletingInProgressMessage: string;
  protected _deleteSuccessMessage: string;
  protected _deleteErrorMessage: string;
  protected _updatingStatusMessage: string;
  protected _updatingStatusSuccessMessage: string;
  protected _updatingStatusErrorMessage: string;
  protected _createSuccessMessage: string;
  protected _createErrorMessage: string;
  protected _updateSuccessMessage: string;
  protected _updateErrorMessage: string;
  readonly dataSource: WritableSignal<Entity[]>;
  readonly displayedColumns: WritableSignal<Array<IDisplayedColumn>>;
  readonly loading: WritableSignal<boolean>;
  readonly paginator: WritableSignal<Paginator>;

  constructor() {
    this.paginator = signal(new Paginator());
    this.loading = signal(false);
    this.dataSource = signal([]);
    this._searchBarSubscription = new Subscription();
    this._numberOfSearches = signal(0);
    this.displayedColumns = signal([]);
    this._urlBackend = '';
    this._errorMessageLoad = '';
    this._titleForModal = {
      create: '',
      update: '',
      delete: '',
    };
    this._deletingInProgressMessage = '';
    this._deleteSuccessMessage = '';
    this._deleteErrorMessage = '';
    this._updatingStatusMessage = '';
    this._updatingStatusSuccessMessage = '';
    this._updatingStatusErrorMessage = '';
    this._createSuccessMessage = '';
    this._createErrorMessage = '';
    this._updateSuccessMessage = '';
    this._updateErrorMessage = '';
  }

  ngOnInit(): void {
    this._buttonAdd$.visible = true;
    this._buttonAdd$.action = this.OpenModalForCreate.bind(this);
    this.getDataSource();
    this._searchBar$.placeholder = 'Buscar una configuración';
    this._searchBarSubscription = this._searchBar$.search$.subscribe({
      next: (search) => this.onSearch(search),
    });
  }

  ngOnDestroy(): void {
    this._searchBarSubscription.unsubscribe();
  }

  pageEvent(event: PageEvent) {
    this.paginator.update((paginator) => {
      paginator.pageIndex = event.pageIndex;
      paginator.pageSize = event.pageSize;
      return paginator;
    });
    this.getDataSource();
  }

  protected onSearch(search: string): void {
    if (search.length === 0 && this._numberOfSearches() > 0) {
      this.getDataSource();
    } else if (search.length > 0) {
      this.loading.set(true);
      const params = new HttpParams()
        .set('page', '0')
        .set('size', this.paginator().pageSize.toString())
        .set('search', search);

      this._http$
        .get<IResponse<IFindAllResponse<Entity>>>(this._urlBackend, params)
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
            this.showSnackBar(this._errorMessageLoad);
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

  protected generateModalInfo(
    data: WritableSignal<Entity>,
    typeForm: TypeForm
  ): MatDialogConfig<IModalForForm<Entity>> {
    return {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: {
        title:
          typeForm === TypeForm.CREATE
            ? this._titleForModal.create
            : this._titleForModal.update,
        submit:
          typeForm === TypeForm.CREATE
            ? this.createSubmit.bind(this)
            : this.updateSubmit.bind(this),
        action: typeForm === TypeForm.CREATE ? 'Registrar' : 'Actualizar',
        form: this.getFieldsInfo(typeForm !== TypeForm.CREATE),
        data,
        typeForm,
      },
    };
  }

  protected getDataSource(): void {
    this.loading.set(true);
    const params = new HttpParams()
      .set('page', this.paginator().pageIndex.toString())
      .set('size', this.paginator().pageSize.toString());
    this._http$
      .get<IResponse<IFindAllResponse<Entity>>>(this._urlBackend, params)
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
          this.showSnackBar(this._errorMessageLoad);
          console.error(error);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
          console.log('Complete', this.paginator());
        },
      });
  }

  protected getActions(entity: Entity): IAction[] {
    return [
      {
        icon: 'detector_status',
        tooltip: 'Estado',
        action: this.changeStatusSubmit.bind(this, entity),
      },
      {
        icon: 'edit',
        tooltip: 'Editar',
        action: this.OpenModalForEdit.bind(this, entity),
      },
      {
        icon: 'delete',
        tooltip: 'Eliminar',
        action: this.OpenModalForDelete.bind(this, entity),
      },
    ];
  }

  protected OpenModalForCreate(): void {
    this._dialog.open(
      ModalForFormComponent,
      this.generateModalInfo(signal({} as Entity), TypeForm.CREATE)
    );
  }

  protected OpenModalForEdit(configuration: Entity): void {
    this._dialog.open(
      ModalForFormComponent,
      this.generateModalInfo(signal(configuration), TypeForm.UPDATE)
    );
  }

  protected OpenModalForDelete(entity: Entity): void {
    const data: Record<string, string> = {};
    Object.keys(entity).forEach((key, index) => {
      if (index === 0) {
        data['id'] = (entity as unknown as Record<string, string>)[key];
      } else {
        data[key] = (entity as unknown as Record<string, string>)[key];
      }
    });
    const dialogRef = this._dialog.open<
      DeleteModalComponent,
      any,
      {
        id: string;
        name: string;
      }
    >(DeleteModalComponent, {
      disableClose: true,
      autoFocus: false,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._globalProgressBar$.visible = true;
        this.showSnackBar(this._deletingInProgressMessage);
        this._http$
          .delete<IResponse<Entity>>(`${this._urlBackend}/${result.id}`)
          .subscribe({
            next: () => {
              this.showSnackBar(
                `${this._deleteSuccessMessage} "${result.name}"`
              );
              this.getDataSource();
            },
            error: (error) => {
              this._globalProgressBar$.visible = false;
              this.showSnackBar(this._deleteErrorMessage);
              console.error(error);
            },
            complete: () => {
              this._globalProgressBar$.visible = false;
            },
          });
      }
    });
  }

  protected changeStatusSubmit(data: Entity): void {
    const id = Object.values(data)[0];
    data.status = !data.status;
    delete data.actions;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;
    delete (data as any)[Object.keys(data)[0]];
    this._globalProgressBar$.visible = true;
    this.showSnackBar(this._updatingStatusMessage);
    this._http$
      .put<Entity, IResponse<Entity>>(`${this._urlBackend}/${id}`, data)
      .subscribe({
        next: (response) => {
          this.showSnackBar(this._updatingStatusSuccessMessage);
          this.getDataSource();
        },
        error: (error) => {
          this._globalProgressBar$.visible = false;
          this.showSnackBar(this._updatingStatusErrorMessage);
          console.error(error);
        },
        complete: () => {
          this._globalProgressBar$.visible = false;
        },
      });
  }

  protected createSubmit(
    config: Entity,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    form.update((form) => {
      form.disable();
      return form;
    });
    this._operationBackend$.visible = true;
    this._http$
      .post<Entity, IResponse<Entity>>(this._urlBackend, config)
      .subscribe({
        next: (response) => {
          this.showSnackBar(this._createSuccessMessage);
          closeForm();
          this.getDataSource();
        },
        error: (error) => {
          this.showSnackBar(this._createErrorMessage);
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
          this._operationBackend$.visible = false;
        },
      });
  }

  protected updateSubmit(
    data: Entity,
    form: WritableSignal<FormGroup>,
    closeForm: Function
  ): void {
    const id = Object.values(data)[0];
    delete (data as any)[Object.keys(data)[0]];
    this._http$
      .put<Entity, IResponse<Entity>>(`${this._urlBackend}/${id}`, data)
      .subscribe({
        next: (response) => {
          this.showSnackBar(this._updateSuccessMessage);
          closeForm();
          this.getDataSource();
        },
        error: (error) => {
          this.showSnackBar(this._updateErrorMessage);
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
          this._operationBackend$.visible = false;
        },
      });
  }

  protected getFieldsInfo(
    withId: boolean = false
  ): WritableSignal<FormField[]> {
    return signal([]);
  }

  private showSnackBar(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snack-bar',
    });
  }
}
