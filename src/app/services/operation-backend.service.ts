import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationBackendService {
  private _visible: boolean;
  private readonly _visible$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this._visible = false;
  }

  get visible$(): Observable<boolean> {
    return this._visible$.asObservable();
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(visible: boolean) {
    if (visible !== this._visible) {
      this._visible = visible;
      this._visible$.next(visible);
    }
  }
}
