import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FullViewportContentService {
  private _fullViewportContent: boolean;
  private readonly _fullViewportContent$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this._fullViewportContent = false;
  }

  get fullViewportContent$(): Observable<boolean> {
    return this._fullViewportContent$.asObservable();
  }

  get fullViewportContent(): boolean {
    return this._fullViewportContent;
  }

  set fullViewportContent(fullViewportContent: boolean) {
    if (fullViewportContent !== this._fullViewportContent) {
      this._fullViewportContent = fullViewportContent;
      this._fullViewportContent$.next(fullViewportContent);
    }
  }
}
