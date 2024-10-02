import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuElement } from '../menu.struct';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private _title: string;
  private _menu: MenuElement[];
  private readonly _menu$ = new BehaviorSubject<MenuElement[]>([]);
  private readonly _title$ = new BehaviorSubject<string>('');

  constructor() {
    this._menu = [];
    this._title = '';
  }

  get menu$(): Observable<MenuElement[]> {
    return this._menu$.asObservable();
  }

  get title$(): Observable<string> {
    return this._title$.asObservable();
  }

  get menu(): MenuElement[] {
    return this._menu;
  }

  set menu(menu: MenuElement[]) {
    if (menu !== this._menu) {
      this._menu = menu;
      this._menu$.next(menu);
    }
  }

  set title(title: string) {
    if (title !== this._title) {
      this._title = title;
      this._title$.next(title);
    }
  }
}
