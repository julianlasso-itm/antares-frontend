import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonAddService {
  private _action: Function;
  private _visible: boolean;
  private readonly _action$ = new BehaviorSubject<Function>(() => false);
  private readonly _visible$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this._visible = false;
    this._action = () => {};
  }

  get visible$(): Observable<boolean> {
    return this._visible$.asObservable();
  }

  get action$(): Observable<Function> {
    return this._action$.asObservable();
  }

  set visible(visible: boolean) {
    if (visible !== this._visible) {
      this._visible = visible;
      this._visible$.next(visible);
    }
  }

  set action(action: Function) {
    if (action !== this._action) {
      this._action = action;
      this._action$.next(action);
    }
  }
}
