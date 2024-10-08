import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  private _placeholder: string;
  private _search: string;
  private readonly _search$ = new BehaviorSubject<string>('');
  private readonly _placeholder$ = new BehaviorSubject<string>('');

  constructor() {
    this._search = '';
    this._placeholder = '';
  }

  get search$(): Observable<string> {
    return this._search$.asObservable();
  }

  get placeholder$(): Observable<string> {
    return this._placeholder$.asObservable();
  }

  get placeholder(): string {
    return this._placeholder;
  }

  get search(): string {
    return this._search;
  }

  set placeholder(placeholder: string) {
    if (placeholder !== this._placeholder) {
      this._placeholder = placeholder;
      this._placeholder$.next(placeholder);
    }
  }

  set search(search: string) {
    if (search !== this._search) {
      this._search = search;
      this._search$.next(search);
    }
  }
}
