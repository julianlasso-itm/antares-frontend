import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalStateService {
  private _state: boolean;
  private readonly _state$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this._state = false;
  }

  get state$(): Observable<boolean> {
    return this._state$.asObservable();
  }

  get state(): boolean {
    return this._state;
  }

  set state(state: boolean) {
    if (state !== this._state) {
      this._state = state;
      this._state$.next(state);
    }
  }
}
