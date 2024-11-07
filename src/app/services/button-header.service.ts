import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonHeaderService {
  private _actionAdd: Function;
  private _actionPartialSave: Function;
  private _actionSaveAndFinish: Function;
  private _actionAssistant: Function;
  private _visibleAdd: boolean;
  private _visiblePartialSave: boolean;
  private _visibleSaveAndFinish: boolean;
  private _visibleAssistant: boolean;
  private _enabledPartialSave: boolean;
  private _enabledSaveAndFinish: boolean;
  private readonly _actionAdd$ = new BehaviorSubject<Function>(() => false);
  private readonly _actionPartialSave$ = new BehaviorSubject<Function>(
    () => false
  );
  private readonly _actionSaveAndFinish$ = new BehaviorSubject<Function>(
    () => false
  );
  private readonly _visibleAdd$ = new BehaviorSubject<boolean>(false);
  private readonly _actionAssistant$ = new BehaviorSubject<Function>(
    () => false
  );
  private readonly _visibleAssistant$ = new BehaviorSubject<boolean>(false);
  private readonly _visiblePartialSave$ = new BehaviorSubject<boolean>(false);
  private readonly _visibleSaveAndFinish$ = new BehaviorSubject<boolean>(false);
  private readonly _enabledPartialSave$ = new BehaviorSubject<boolean>(false);
  private readonly _enabledSaveAndFinish$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this._enabledPartialSave = false;
    this._enabledSaveAndFinish = false;
    this._visibleAdd = false;
    this._actionAdd = () => {};
    this._visibleAssistant = false;
    this._actionAssistant = () => {};
    this._visiblePartialSave = false;
    this._actionPartialSave = () => {};
    this._visibleSaveAndFinish = false;
    this._actionSaveAndFinish = () => {};
  }

  get visibleAdd$(): Observable<boolean> {
    return this._visibleAdd$.asObservable();
  }

  get visiblePartialSave$(): Observable<boolean> {
    return this._visiblePartialSave$.asObservable();
  }

  get visibleSaveAndFinish$(): Observable<boolean> {
    return this._visibleSaveAndFinish$.asObservable();
  }

  get visibleAssistant$(): Observable<boolean> {
    return this._visibleAssistant$.asObservable();
  }

  get actionAdd$(): Observable<Function> {
    return this._actionAdd$.asObservable();
  }

  get actionPartialSave$(): Observable<Function> {
    return this._actionPartialSave$.asObservable();
  }

  get actionSaveAndFinish$(): Observable<Function> {
    return this._actionSaveAndFinish$.asObservable();
  }

  get actionAssistant$(): Observable<Function> {
    return this._actionAssistant$.asObservable();
  }

  get enabledPartialSave$(): Observable<boolean> {
    return this._enabledPartialSave$.asObservable();
  }

  get enabledSaveAndFinish$(): Observable<boolean> {
    return this._enabledSaveAndFinish$.asObservable();
  }

  set visibleAdd(visible: boolean) {
    if (visible !== this._visibleAdd) {
      this._visibleAdd = visible;
      this._visibleAdd$.next(visible);
    }
  }

  set visiblePartialSave(visible: boolean) {
    if (visible !== this._visiblePartialSave) {
      this._visiblePartialSave = visible;
      this._visiblePartialSave$.next(visible);
    }
  }

  set visibleSaveAndFinish(visible: boolean) {
    if (visible !== this._visibleSaveAndFinish) {
      this._visibleSaveAndFinish = visible;
      this._visibleSaveAndFinish$.next(visible);
    }
  }

  set visibleAssistant(visible: boolean) {
    if (visible !== this._visibleAssistant) {
      this._visibleAssistant = visible;
      this._visibleAssistant$.next(visible);
    }
  }

  set actionAdd(action: Function) {
    if (action !== this._actionAdd) {
      this._actionAdd = action;
      this._actionAdd$.next(action);
    }
  }

  set actionPartialSave(action: Function) {
    if (action !== this._actionPartialSave) {
      this._actionPartialSave = action;
      this._actionPartialSave$.next(action);
    }
  }

  set actionSaveAndFinish(action: Function) {
    if (action !== this._actionSaveAndFinish) {
      this._actionSaveAndFinish = action;
      this._actionSaveAndFinish$.next(action);
    }
  }

  set actionAssistant(action: Function) {
    if (action !== this._actionAssistant) {
      this._actionAssistant = action;
      this._actionAssistant$.next(action);
    }
  }

  set enabledPartialSave(enabled: boolean) {
    if (enabled !== this._enabledPartialSave) {
      this._enabledPartialSave = enabled;
      this._enabledPartialSave$.next(enabled);
    }
  }

  set enabledSaveAndFinish(enabled: boolean) {
    if (enabled !== this._enabledSaveAndFinish) {
      this._enabledSaveAndFinish = enabled;
      this._enabledSaveAndFinish$.next(enabled);
    }
  }
}
