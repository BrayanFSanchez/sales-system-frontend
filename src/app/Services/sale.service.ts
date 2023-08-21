import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Sale } from '../Interfaces/sale';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private urlApi: string = environment.endpoint + 'Sale/';

  constructor(private http: HttpClient) {}

  register(request: Sale): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Register`, request);
  }

  record(
    tolookFor: string,
    saleNumber: string,
    startDate: string,
    endingDate: string
  ): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.urlApi}Record?tolookFor=${tolookFor}&saleNumber=${saleNumber}&startDate=${startDate}&endingDate=${endingDate}`
    );
  }

  report(startDate: string, endingDate: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.urlApi}Report?startDate=${startDate}&endingDate=${endingDate}`
    );
  }
}
