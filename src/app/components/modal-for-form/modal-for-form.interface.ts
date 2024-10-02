import { WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  errors?: Array<IError>;
  icon?: string;
  formControl?: WritableSignal<FormControl>;
  loadOptions?: WritableSignal<Array<object>>;
  selectionChange?: (...args: any) => void;
  options?: Array<any>;
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
}
