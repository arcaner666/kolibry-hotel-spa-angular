import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ContactFormDto } from 'src/app/models/dtos/contact-form-dto';
import { ContactFormDtoErrors } from 'src/app/models/validation-errors/contact-form-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  private controllerUrl: string = "contactforms";
  private _emptyContactFormDto: ContactFormDto = {
    contactFormId: 0,
    nameSurname: "",
    email: "",
    phone: "",
    message: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  private _emptyContactFormDtoErrors: ContactFormDtoErrors = {
    contactFormId: "",
    nameSurname: "",
    email: "",
    phone: "",
    message: "",
    createdAt: "",
    updatedAt: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyContactFormDto(): ContactFormDto {
    return cloneDeep(this._emptyContactFormDto);
  }

  public get emptyContactFormDtoErrors(): ContactFormDtoErrors {
    return cloneDeep(this._emptyContactFormDtoErrors);
  }

  add(contactFormDto: ContactFormDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, contactFormDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  getAll(): Observable<ListDataResult<ContactFormDto>> {
    return this.http.get<ListDataResult<ContactFormDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }

  getById(id: number): Observable<SingleDataResult<ContactFormDto>> {
    return this.http.get<SingleDataResult<ContactFormDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyid/${id}`);
  }
}
