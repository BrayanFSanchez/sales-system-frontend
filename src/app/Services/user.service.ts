import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlApi: string = environment.endpoint + 'User/';

  constructor(private http: HttpClient) {}

  login(request: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Login`, request);
  }

  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}List`);
  }

  save(request: User): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Save`, request);
  }

  edit(request: User): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Edit`, request);
  }

  delete(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Delete/${id}`);
  }
}
