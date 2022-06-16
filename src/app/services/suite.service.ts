import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';
import { SuiteDto } from 'src/app/models/dtos/suite-dto';
import { SuiteDtoErrors } from 'src/app/models/validation-errors/suite-dto-errors';

@Injectable({
  providedIn: 'root'
})
export class SuiteService {

  private controllerUrl: string = "suites";
  private _emptySuiteDto: SuiteDto = {
    suiteId: 0,
    title: "",
    bed: 0,
    m2: 0,
    price: 0,
    vat: 0,
    totalVat: 0,
    totalPrice: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  private _emptySuiteDtoErrors: SuiteDtoErrors = {
    suiteId: "",
    title: "",
    bed: "",
    m2: "",
    price: "",
    vat: "",
    totalVat: "",
    totalPrice: "",
    createdAt: "",
    updatedAt: "",
  };

  constructor(
    private http: HttpClient,
  ) {}

  public get emptySuiteDto(): SuiteDto {
    return cloneDeep(this._emptySuiteDto);
  }

  public get emptySuiteDtoErrors(): SuiteDtoErrors {
    return cloneDeep(this._emptySuiteDtoErrors);
  }

  add(suiteDto: SuiteDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, suiteDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  getAll(): Observable<ListDataResult<SuiteDto>> {
    return this.http.get<ListDataResult<SuiteDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }

  getById(id: number): Observable<SingleDataResult<SuiteDto>> {
    return this.http.get<SingleDataResult<SuiteDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyid/${id}`);
  }

  update(suiteDto: SuiteDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, suiteDto);
  }
}
