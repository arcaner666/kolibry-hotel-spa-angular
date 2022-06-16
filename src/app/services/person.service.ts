import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { PersonDto } from 'src/app/models/dtos/person-dto';
import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';
import { PersonExtDtoErrors } from 'src/app/models/validation-errors/person-ext-dto-errors';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private controllerUrl: string = "persons";
  private personExtDtoSubject: BehaviorSubject<PersonExtDto>;
  private _emptyPersonExtDto: PersonExtDto = {
    personId: 0,
    email: "",
    phone: "",
    role: "",
    blocked: false,
    refreshToken: "",
    refreshTokenExpiryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended
    oldPassword: "",
    password: "",
    passwordAgain: "",
    refreshTokenDuration: 0,
    accessToken: "",
  };
  private _emptyPersonExtDtoErrors: PersonExtDtoErrors = {
    personId: "",
    email: "",
    phone: "",
    role: "",
    blocked: "",
    refreshToken: "",
    refreshTokenExpiryTime: "",
    createdAt: "",
    updatedAt: "",
  
    // Extended
    oldPassword: "",
    password: "",
    passwordAgain: "",
    refreshTokenDuration: "",
    accessToken: "",
  };

  public personExtDto$: Observable<PersonExtDto>;

  constructor(
    private http: HttpClient,
  ) {
    this.personExtDtoSubject = new BehaviorSubject<PersonExtDto>(JSON.parse(localStorage.getItem('personExtDto')!));
    this.personExtDto$ = this.personExtDtoSubject.asObservable();
  }

  // Kullanıcıyı localStorage'dan ve person.service'den silmek için kısayol.
  clearPersonExtDto(): void {
    localStorage.removeItem('personExtDto');
    this.personExtDtoSubject.next(cloneDeep(this._emptyPersonExtDto));
  }

  // Kullanıcıyı dış component'lerden almak için kısayol.
  public get personExtDto(): PersonExtDto {
    return this.personExtDtoSubject.value;
  }

  // Kullanıcıyı değiştirmek için bir kısayol.
  public set personExtDto(personExtDto: PersonExtDto){
    localStorage.setItem("personExtDto", JSON.stringify(personExtDto));
    this.personExtDtoSubject.next(personExtDto);
  }

  public get emptyPersonExtDto(): PersonExtDto {
    return cloneDeep(this._emptyPersonExtDto);
  }

  public get emptyPersonExtDtoErrors(): PersonExtDtoErrors {
    return cloneDeep(this._emptyPersonExtDtoErrors);
  }

  // API İstekleri
  add(personExtDto: PersonExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, personExtDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  getExts(): Observable<ListDataResult<PersonExtDto>> {
    return this.http.get<ListDataResult<PersonExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getexts`);
  }

  loginWithEmail(personExtDto: PersonExtDto): Observable<SingleDataResult<PersonExtDto>> {
    return this.http.post<SingleDataResult<PersonExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/loginwithemail`, personExtDto);
  }

  loginWithPhone(personExtDto: PersonExtDto): Observable<SingleDataResult<PersonExtDto>> {
    return this.http.post<SingleDataResult<PersonExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/loginwithphone`, personExtDto);
  }

  logout(): Observable<Result> {
    return this.http.get<Result>(`${environment.apiUrl}/${this.controllerUrl}/logout`);
  }

  refreshAccessToken(personExtDto: PersonExtDto): Observable<SingleDataResult<PersonExtDto>> {
    return this.http.post<SingleDataResult<PersonExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/refreshaccesstoken`, personExtDto);
  }

  update(personExtDto: PersonExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, personExtDto);
  }
}
