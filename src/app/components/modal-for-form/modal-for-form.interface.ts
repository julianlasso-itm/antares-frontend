import { WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ISelectData } from '../form/select-data.interface';

export interface IModalForForm<TData> {
  title: string;
  form: WritableSignal<Array<FormField>>;
  submit: Function;
  action: string;
  data: WritableSignal<TData>;
  typeForm: TypeForm;
}

export enum TypeForm {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface FormField {
  field: string;
  label?: string;
  type: TypeInput;
  placeholder?: string;
  errors?: IError[];
  icon?: string;
  formControl: WritableSignal<FormControl>;
  loadOptions?: Promise<WritableSignal<ISelectData[]>>;
  selectionChange?: (...args: any) => void;
  options?: any[];
  defaultValue?: any;
}

export interface IError {
  type: TypeError;
  message: string;
}

export enum TypeError {
  MIN = 'min',
  MAX = 'max',
  REQUIRED = 'required',
  REQUIRED_TRUE = 'requiredTrue',
  EMAIL = 'email',
  MIN_LENGTH = 'minlength',
  MAX_LENGTH = 'maxlength',
  PATTERN = 'pattern',
  NULL = 'nullValidator',
  COMPOSE = 'compose',
  COMPOSE_ASYNC = 'composeAsync',
}

export enum TypeInput {
  HIDDEN = 'hidden',
  TEXT = 'text',
  EMAIL = 'email',
  TEL = 'tel',
  SELECT = 'select',
  SLIDE_TOGGLE = 'slide-toggle',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  PASSWORD = 'password',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
}
