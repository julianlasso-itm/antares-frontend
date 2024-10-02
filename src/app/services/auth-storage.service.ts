import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private static readonly storage: Storage = localStorage;
  private static readonly newItem: BehaviorSubject<Map<string, string>> =
    new BehaviorSubject<Map<string, string>>(new Map<string, string>());

  private static readonly newItem$ = AuthStorageService.newItem.asObservable();

  static getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  static removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  static setItem(key: string, data: string): void {
    this.storage.setItem(key, data);
    this.newItem.next(new Map<string, string>().set(key, data));
  }

  static clear(): void {
    this.storage.clear();
  }

  public getItemObservable(): Observable<Map<string, string>> {
    return AuthStorageService.newItem$;
  }
}
