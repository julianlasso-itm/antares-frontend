import { HttpParams } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { IFindAllResponse, IResponse } from '../../modules/response.interface';
import { ButtonHeaderService } from '../../services/button-header.service';
import { GlobalProgressBarService } from '../../services/global-progress-bar.service';
import { HttpService } from '../../services/http.service';
import { MenuService } from '../../services/menu.service';
import { OperationBackendService } from '../../services/operation-backend.service';
import { SearchBarService } from '../../services/search-bar.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { ISelectData } from '../form/select-data.interface';
import { ModalForFormComponent } from '../modal-for-form/modal-for-form.component';
import {
  FormField,
  IModalForForm,
  TypeError,
  TypeForm,
  TypeInput,
} from '../modal-for-form/modal-for-form.interface';
import { IAction } from '../table/action.interface';
import { IDisplayedColumn } from '../table/displayed-columns.interface';
import { Paginator } from '../table/paginator.class';
import { IEntity } from './entity.interface';

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [],
  template: '',
})
export class GenericCrudComponent<Entity extends IEntity> {
  protected _searchBarSubscription: Subscription;
  protected readonly _buttonHeader$ = inject(ButtonHeaderService);
  protected readonly _dialog = inject(MatDialog);
  protected readonly _globalProgressBar$ = inject(GlobalProgressBarService);
  protected readonly _http$ = inject(HttpService);
  protected readonly _numberOfSearches: WritableSignal<number>;
  protected readonly _operationBackend$ = inject(OperationBackendService);
  protected readonly _searchBar$ = inject(SearchBarService);
  protected readonly _notification = inject(ToastrService);
  protected readonly _menuService = inject(MenuService);
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
  protected readonly _filter: WritableSignal<string>;
  protected _dataForModalCreate!: WritableSignal<
    MatDialogConfig<IModalForForm<Entity>>
  >;
  protected _dataForModalUpdate!: WritableSignal<
    MatDialogConfig<IModalForForm<Entity>>
  >;
  readonly dataSource: WritableSignal<Entity[]>;
  readonly displayedColumns: WritableSignal<Array<IDisplayedColumn>>;
  readonly loading: WritableSignal<boolean>;
  readonly paginator: WritableSignal<Paginator>;

  constructor() {
    this._searchBar$.disabled = false;
    this.paginator = signal(new Paginator());
    this.loading = signal(false);
    this.dataSource = signal([]);
    this._searchBarSubscription = new Subscription();
    this._numberOfSearches = signal(0);
    this.displayedColumns = signal([]);
    this._urlBackend = '';
    this._searchBar$.placeholder = '';
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
    this._filter = signal('');
  }

  ngOnInit(): void {
    this._buttonHeader$.visibleAssistant = false;
    this._buttonHeader$.actionAssistant = () => {
      console.log('Asistente');
    };
    this._buttonHeader$.visibleAdd = true;
    this._buttonHeader$.actionAdd = this.OpenModalForCreate.bind(this);
    this.getDataSource();
    this._searchBarSubscription = this._searchBar$.search$.subscribe({
      next: (search) => this.onSearch(search),
    });
    this._dataForModalCreate = signal(
      this.generateModalInfo(signal({} as Entity), TypeForm.CREATE)
    );
    this._dataForModalUpdate = signal(
      this.generateModalInfo(signal({} as Entity), TypeForm.UPDATE)
    );
  }

  ngOnDestroy(): void {
    this._searchBarSubscription.unsubscribe();
    this._searchBar$.clear = true;
    this._searchBar$.search = '';
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
      let params = new HttpParams()
        .set('page', '0')
        .set('size', this.paginator().pageSize.toString())
        .set('search', search);
      if (this._filter() !== '') {
        params = params.set('filter', this._filter());
      }

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
            this.showSnackBar(this._errorMessageLoad, 'error');
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
      width: '500px',
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
    let params = new HttpParams()
      .set('page', this.paginator().pageIndex.toString())
      .set('size', this.paginator().pageSize.toString());
    if (this._filter() !== '') {
      params = params.set('filter', this._filter());
    }
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
          this.showSnackBar(this._errorMessageLoad, 'error');
          console.error(error);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
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
    this._dialog.open(ModalForFormComponent, this._dataForModalCreate());
  }

  protected OpenModalForEdit(configuration: Entity): void {
    this._dataForModalUpdate.update((config) => {
      config.data?.data.set(configuration);
      return config;
    });
    this._dialog.open(ModalForFormComponent, this._dataForModalUpdate());
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
        this.showSnackBar(this._deletingInProgressMessage, 'info');
        this._http$
          .delete<IResponse<Entity>>(`${this._urlBackend}/${result.id}`)
          .subscribe({
            next: () => {
              this.showSnackBar(
                `${this._deleteSuccessMessage} "${result.name}"`,
                'success'
              );
              this.getDataSource();
            },
            error: (error) => {
              this._globalProgressBar$.visible = false;
              this.showSnackBar(this._deleteErrorMessage, 'error');
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
    this.showSnackBar(this._updatingStatusMessage, 'info');
    this._http$
      .put<Entity, IResponse<Entity>>(`${this._urlBackend}/${id}`, data)
      .subscribe({
        next: (response) => {
          this.showSnackBar(this._updatingStatusSuccessMessage, 'success');
          this.getDataSource();
        },
        error: (error) => {
          this._globalProgressBar$.visible = false;
          this.showSnackBar(this._updatingStatusErrorMessage, 'error');
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
    let params = new HttpParams();
    if (this._filter() !== '') {
      params = params.set('filter', this._filter());
    }
    this._http$
      .post<Entity, IResponse<Entity>>(this._urlBackend, config, params)
      .subscribe({
        next: (response) => {
          this.showSnackBar(this._createSuccessMessage, 'success');
          closeForm();
          this.getDataSource();
        },
        error: (error) => {
          this.showSnackBar(this._createErrorMessage, 'error');
          console.error(error);
          form.update((form) => {
            form.enable();
            return form;
          });
          this._operationBackend$.visible = false;
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
          this.showSnackBar(this._updateSuccessMessage, 'success');
          closeForm();
          this.getDataSource();
        },
        error: (error) => {
          this.showSnackBar(this._updateErrorMessage, 'error');
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

  protected createSelectField(properties: {
    field: string;
    label: string;
    placeholder: string;
    icon: string;
    loadOptions: Observable<WritableSignal<ISelectData[]>>;
    selectionChange: (...args: any) => Observable<any>;
    required?: boolean;
    disabled?: boolean;
  }): FormField {
    const errors = properties.required
      ? [
          {
            type: TypeError.REQUIRED,
            message: `${properties.label} es requerido`,
          },
        ]
      : [];
    return {
      field: properties.field,
      label: properties.label,
      type: TypeInput.SELECT,
      placeholder: properties.placeholder,
      icon: properties.icon,
      loadOptions: properties.loadOptions,
      selectionChange: properties.selectionChange,
      formControl: signal(
        new FormControl(
          {
            value: null,
            disabled: properties.disabled ?? false,
          },
          {
            nonNullable: true,
            validators: [
              properties.required
                ? Validators.required
                : Validators.nullValidator,
            ],
          }
        )
      ),
      errors,
    };
  }

  protected createNumberField(properties: {
    field: string;
    label: string;
    placeholder: string;
    icon: string;
    options: {
      defaultValue?: number;
      min?: number;
      max?: number;
      step?: number;
    };
    required?: boolean;
    disabled?: boolean;
  }): FormField {
    const errors = properties.required
      ? [
          {
            type: TypeError.REQUIRED,
            message: `${properties.label} es requerido`,
          },
        ]
      : [];
    return {
      field: properties.field,
      label: properties.label,
      type: TypeInput.NUMBER,
      placeholder: properties.placeholder,
      icon: properties.icon,
      options: properties.options,
      formControl: signal(
        new FormControl(
          {
            value: properties.options.defaultValue ?? null,
            disabled: properties.disabled ?? false,
          },
          {
            nonNullable: true,
            validators: [
              properties.required
                ? Validators.required
                : Validators.nullValidator,
              properties.options.min
                ? Validators.min(properties.options.min)
                : Validators.nullValidator,
              properties.options.max
                ? Validators.max(properties.options.max)
                : Validators.nullValidator,
            ],
          }
        )
      ),
      errors: [
        ...errors,
        {
          type: TypeError.MIN,
          message: `${properties.label} no debe ser menor que ${properties.options.min}`,
        },
        {
          type: TypeError.MAX_LENGTH,
          message: `${properties.label} no debe exceder los ${properties.options.max} caracteres`,
        },
      ],
    };
  }

  protected createFileField(properties: {
    field: string;
    label: string;
    placeholder: string;
    icon: string;
    required?: boolean;
    disabled?: boolean;
  }): FormField {
    const errors = properties.required
      ? [
          {
            type: TypeError.REQUIRED,
            message: `${properties.label} es requerido`,
          },
        ]
      : [];
    return {
      field: properties.field,
      label: properties.label,
      type: TypeInput.FILE,
      placeholder: properties.placeholder,
      icon: properties.icon,
      formControl: signal(
        new FormControl(
          {
            value: null,
            disabled: properties.disabled ?? false,
          },
          {
            nonNullable: true,
            validators: [
              properties.required
                ? Validators.required
                : Validators.nullValidator,
            ],
          }
        )
      ),
      errors: [...errors],
    };
  }

  protected createAutocompleteField(properties: {
    field: string;
    label: string;
    placeholder: string;
    icon: string;
    autocompleteOptions: (
      ...args: any
    ) => Observable<WritableSignal<ISelectData[]>>;
    selectionChange?: (...args: any) => Observable<any>;
    required?: boolean;
    disabled?: boolean;
  }): FormField {
    const errors = properties.required
      ? [
          {
            type: TypeError.REQUIRED,
            message: `${properties.label} es requerido`,
          },
        ]
      : [];
    return {
      field: properties.field,
      label: properties.label,
      type: TypeInput.AUTOCOMPLETE,
      placeholder: properties.placeholder,
      icon: properties.icon,
      autocompleteOptions: properties.autocompleteOptions,
      selectionChange: properties.selectionChange,
      formControl: signal(
        new FormControl(
          {
            value: null,
            disabled: properties.disabled ?? false,
          },
          {
            nonNullable: true,
            validators: [
              properties.required
                ? Validators.required
                : Validators.nullValidator,
            ],
          }
        )
      ),
      errors: [...errors],
    };
  }

  protected createDateField(properties: {
    field: string;
    label: string;
    placeholder: string;
    icon: string;
    required?: boolean;
    disabled?: boolean;
  }): FormField {
    const errors = properties.required
      ? [
          {
            type: TypeError.REQUIRED,
            message: `${properties.label} es requerido`,
          },
        ]
      : [];
    return {
      field: properties.field,
      label: properties.label,
      type: TypeInput.DATE,
      placeholder: properties.placeholder,
      icon: properties.icon,
      formControl: signal(
        new FormControl(
          {
            value: null,
            disabled: properties.disabled ?? false,
          },
          {
            nonNullable: true,
            validators: [
              properties.required
                ? Validators.required
                : Validators.nullValidator,
            ],
          }
        )
      ),
      errors: [...errors],
    };
  }

  protected createTextField(properties: {
    field: string;
    label: string;
    placeholder: string;
    icon: string;
    maxLength: number;
    required?: boolean;
    disabled?: boolean;
  }): FormField {
    const errors = properties.required
      ? [
          {
            type: TypeError.REQUIRED,
            message: `${properties.label} es requerido`,
          },
        ]
      : [];
    return {
      field: properties.field,
      label: properties.label,
      type: TypeInput.TEXT,
      placeholder: properties.placeholder,
      icon: properties.icon,
      formControl: signal(
        new FormControl(
          {
            value: null,
            disabled: properties.disabled ?? false,
          },
          {
            nonNullable: true,
            validators: [
              properties.required
                ? Validators.required
                : Validators.nullValidator,
              Validators.maxLength(properties.maxLength),
            ],
          }
        )
      ),
      errors: [
        ...errors,
        {
          type: TypeError.MAX_LENGTH,
          message: `${properties.label} no debe exceder los ${properties.maxLength} caracteres`,
        },
      ],
    };
  }

  protected createTextAreaField(properties: {
    field: string;
    label: string;
    placeholder: string;
    icon: string;
    maxLength: number;
    required?: boolean;
    disabled?: boolean;
  }): FormField {
    const errors = properties.required
      ? [
          {
            type: TypeError.REQUIRED,
            message: `${properties.label} es requerido`,
          },
        ]
      : [];
    return {
      field: properties.field,
      label: properties.label,
      type: TypeInput.TEXTAREA,
      placeholder: properties.placeholder,
      icon: properties.icon,
      formControl: signal(
        new FormControl(
          {
            value: null,
            disabled: properties.disabled ?? false,
          },
          {
            validators: [
              properties.required
                ? Validators.required
                : Validators.nullValidator,
              Validators.maxLength(properties.maxLength),
            ],
          }
        )
      ),
      errors: [
        ...errors,
        {
          type: TypeError.MAX_LENGTH,
          message: `${properties.label} no debe exceder los ${properties.maxLength} caracteres`,
        },
      ],
    };
  }

  protected createHiddenField(field: string): FormField {
    return {
      field,
      type: TypeInput.HIDDEN,
      formControl: signal(
        new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required],
        })
      ),
    };
  }

  protected showSnackBar(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ): void {
    const config: Partial<IndividualConfig> = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      timeOut: 10000,
    };
    if (type === 'success') {
      this._notification.success(message, this.getRandomMessage(), config);
    } else if (type === 'error') {
      this._notification.error(message, this.getRandomErrorMessage(), config);
    } else if (type === 'info') {
      this._notification.info(message, undefined, { ...config, timeOut: 2000 });
    } else if (type === 'warning') {
      this._notification.warning(message, undefined, config);
    }
  }

  private readonly successMessages: string[] = [
    'Excelente trabajo',
    '¡Bien hecho!',
    'Lo lograste, felicidades',
    'Sigue así, vas genial',
    '¡Eres increíble!',
    'Buen progreso',
    'Estás logrando grandes cosas',
    'Superaste mis expectativas',
    'Increíble esfuerzo',
    'Gran avance',
    '¡Lo hiciste perfectamente!',
    'Tu esfuerzo da frutos',
    'Muy buen resultado',
    'Sigue destacándote',
    '¡Eso es tener éxito!',
    'Impresionante dedicación',
    'Tu talento brilla',
    'Vas por muy buen camino',
    'Orgulloso de tu logro',
    'Tu compromiso es admirable',
  ];

  private readonly errorMessages: string[] = [
    '¡Vaya, no te has podido!',
    'Error inesperado',
    'Algo ha ido mal',
    'Operación fallida',
    'Algo ha salido mal',
    'Operación cancelada',
    'Houston, we have a problem',
  ];

  private getRandomMessage(): string {
    return this.successMessages[
      Math.floor(Math.random() * this.successMessages.length)
    ];
  }

  protected mapDataToISelectData<IType>(
    response: IResponse<IFindAllResponse<IType>>,
    record: { value: string; label: string },
    defaultValue?: ISelectData
  ): WritableSignal<ISelectData[]> {
    const getValueByPath = (obj: Record<string, any>, path: string): any => {
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };

    const uniqueDataMap = new Map<string, ISelectData>();
    if (defaultValue) {
      uniqueDataMap.set(
        `${defaultValue.value}-${defaultValue.label}`,
        defaultValue
      );
    }

    response.value.data.forEach((type) => {
      const value = getValueByPath(type as Record<string, any>, record.value);
      const label = getValueByPath(type as Record<string, any>, record.label);
      const key = `${value}-${label}`;

      if (!uniqueDataMap.has(key)) {
        uniqueDataMap.set(key, { value, label } as ISelectData);
      }
    });

    const data = Array.from(uniqueDataMap.values());

    return signal(data);
  }

  protected updateOptions<IType>(
    config: MatDialogConfig<IModalForForm<IType>>,
    data: WritableSignal<ISelectData[]>,
    targetField: string
  ): MatDialogConfig<IModalForForm<IType>> {
    config.data?.form().find((field) => {
      if (field.field !== targetField) {
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

  protected catchError(
    error: Error,
    message: string
  ): Observable<WritableSignal<ISelectData[]>> {
    this.showSnackBar(message, 'error');
    console.error(error);
    return of(signal([]));
  }

  private getRandomErrorMessage(): string {
    return this.errorMessages[
      Math.floor(Math.random() * this.errorMessages.length)
    ];
  }
}
