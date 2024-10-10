import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  private _placeholder: string;
  private _search: string;
  private _disabled: boolean;
  private readonly _search$ = new BehaviorSubject<string>('');
  private readonly _clear$ = new BehaviorSubject<boolean>(false);
  private readonly _placeholder$ = new BehaviorSubject<string>('');
  private readonly _disabled$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this._search = '';
    this._placeholder = '';
    this._disabled = false;
  }

  get search$(): Observable<string> {
    return this._search$.asObservable();
  }

  get clear$(): Observable<boolean> {
    return this._clear$.asObservable();
  }

  get placeholder$(): Observable<string> {
    return this._placeholder$.asObservable();
  }

  get disabled$(): Observable<boolean> {
    return this._disabled$.asObservable();
  }

  get placeholder(): string {
    return this._placeholder;
  }

  get search(): string {
    return this._search;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set placeholder(placeholder: string) {
    if (placeholder !== this._placeholder) {
      this._placeholder = placeholder;
      this._placeholder$.next(placeholder);
    }
  }

  set clear(clear: boolean) {
    this._clear$.next(clear);
  }

  set search(search: string) {
    if (search !== this._search) {
      this._search = search;
      this._search$.next(search);
    }
  }

  set disabled(disabled: boolean) {
    if (disabled !== this._disabled) {
      this._disabled = disabled;
      this._disabled$.next(disabled);
    }
  }
}
