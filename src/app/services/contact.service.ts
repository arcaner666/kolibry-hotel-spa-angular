import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ContactDto } from 'src/app/models/dtos/contact-dto';
import { ContactDtoErrors } from 'src/app/models/validation-errors/contact-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private controllerUrl: string = "contacts";
  private _emptyContactDto: ContactDto = {
    contactId: 0,
    nameSurname: "",
    email: "",
    phone: "",
    message: "",
  };
  private _emptyContactDtoErrors: ContactDtoErrors = {
    contactId: "",
    nameSurname: "",
    email: "",
    phone: "",
    message: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyContactDto(): ContactDto {
    return cloneDeep(this._emptyContactDto);
  }

  public get emptyContactDtoErrors(): ContactDtoErrors {
    return cloneDeep(this._emptyContactDtoErrors);
  }

  add(contactDto: ContactDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, contactDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  getAll(): Observable<ListDataResult<ContactDto>> {
    return this.http.get<ListDataResult<ContactDto>>(`${environment.apiUrl}/${this.controllerUrl}`);
  }

  update(contactDto: ContactDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, contactDto);
  }
}
