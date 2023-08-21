import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private urlApi: string = environment.endpoint + 'Menu/';

  constructor(private http: HttpClient) {}

  list(idUser: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}List?idUser=${idUser}`);
  }
}
