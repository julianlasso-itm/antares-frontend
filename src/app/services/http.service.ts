import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly urlBase: string;
  private readonly httpClient = inject(HttpClient);

  constructor() {
    this.urlBase = environment.apiUrl;
  }

  public get<TResponse>(
    url: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<TResponse> {
    return this.httpClient.get<TResponse>(this.urlBase + url, {
      headers,
      params,
    });
  }

  public post<TRequest, TResponse>(
    url: string,
    body: TRequest,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<TResponse> {
    return this.httpClient.post<TResponse>(this.urlBase + url, body, {
      headers,
      params,
    });
  }

  public put<TRequest, TResponse>(
    url: string,
    body: TRequest,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<TResponse> {
    return this.httpClient.put<TResponse>(this.urlBase + url, body, {
      headers,
      params,
    });
  }

  public delete<TResponse>(
    url: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<TResponse> {
    return this.httpClient.delete<TResponse>(this.urlBase + url, {
      headers,
      params,
    });
  }
}
