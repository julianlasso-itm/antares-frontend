import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonHeaderService {
  private _actionAdd: Function;
  private _actionAssistant: Function;
  private _visibleAdd: boolean;
  private _visibleAssistant: boolean;
  private readonly _actionAdd$ = new BehaviorSubject<Function>(() => false);
  private readonly _visibleAdd$ = new BehaviorSubject<boolean>(false);
  private readonly _actionAssistant$ = new BehaviorSubject<Function>(
    () => false
  );
  private readonly _visibleAssistant$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this._visibleAdd = false;
    this._actionAdd = () => {};
    this._visibleAssistant = false;
    this._actionAssistant = () => {};
  }

  get visibleAdd$(): Observable<boolean> {
    return this._visibleAdd$.asObservable();
  }

  get visibleAssistant$(): Observable<boolean> {
    return this._visibleAssistant$.asObservable();
  }

  get actionAdd$(): Observable<Function> {
    return this._actionAdd$.asObservable();
  }

  get actionAssistant$(): Observable<Function> {
    return this._actionAssistant$.asObservable();
  }

  set visibleAdd(visible: boolean) {
    if (visible !== this._visibleAdd) {
      this._visibleAdd = visible;
      this._visibleAdd$.next(visible);
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

  set actionAssistant(action: Function) {
    if (action !== this._actionAssistant) {
      this._actionAssistant = action;
      this._actionAssistant$.next(action);
    }
  }
}
