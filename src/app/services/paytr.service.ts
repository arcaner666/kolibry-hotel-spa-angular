import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { Ip } from 'src/app/models/various/ip';
import { PayTrIframeDto } from 'src/app/models/dtos/paytr-iframe-dto';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class PayTrService {

  private controllerUrl: string = "paytr";
  private _emptyPayTrIframeDto: PayTrIframeDto = {
    nameSurname: "",
    email: "",
    phone: "",
    address: "",
    paymentAmount: 0,
    userBasket: [],
    merchantOid: "",
    merchantOkUrl: "",
    merchantFailUrl: "",
    userIp: "",
    currency: "",
    language: "",
    iframeToken: "",
  };

  constructor(
    private http: HttpClient,
  ) {}

  public get emptyPayTrIframeDto(): PayTrIframeDto {
    return cloneDeep(this._emptyPayTrIframeDto);
  }

  getClientIp() {
    return this.http.get<Ip>("https://api.ipify.org/?format=json");
  }

  getIframeToken(payTrIframeDto: PayTrIframeDto): Observable<SingleDataResult<PayTrIframeDto>> {
    return this.http.post<SingleDataResult<PayTrIframeDto>>(`${environment.apiUrl}/${this.controllerUrl}/getiframetoken`, payTrIframeDto);
  }
}
