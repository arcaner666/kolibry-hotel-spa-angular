import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { InvoiceDetailDto } from 'src/app/models/dtos/invoice-detail-dto';
import { InvoiceDetailDtoErrors } from 'src/app/models/validation-errors/invoice-detail-dto-errors';
import { InvoiceExtDto } from 'src/app/models/dtos/invoice-ext-dto';
import { InvoiceExtDtoErrors } from 'src/app/models/validation-errors/invoice-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private controllerUrl: string = "invoices";
  private _emptyInvoiceDetailDto: InvoiceDetailDto = {
    invoiceDetailId: 0,
    invoiceId: 0,
    suiteId: 0,
    amount: 0,
    price: 0,
    vat: 0,
    totalVat: 0,
    totalPrice: 0,
  };
  private _emptyInvoiceDetailDtoErrors: InvoiceDetailDtoErrors = {
    invoiceDetailId: "",
    invoiceId: "",
    suiteId: "",
    amount: "",
    price: "",
    vat: "",
    totalVat: "",
    totalPrice: "",
  };
  private _emptyInvoiceExtDto: InvoiceExtDto = {
    invoiceId: 0,
    currencyId: 0,
    buyerNameSurname: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerAddress: "",
    buyerIp: "",
    reservationStartDate: new Date(),
    reservationEndDate: new Date(),
    adult: 0,
    child: 0,
    childAge1: 0,
    childAge2: 0,
    childAge3: 0,
    childAge4: 0,
    childAge5: 0,
    childAge6: 0,
    title: "",
    netPrice: 0,
    vat: 0,
    totalVat: 0,
    totalPrice: 0,
    paid: false,
    canceled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    // Extended With InvoiceType
    // Extended With PaymentType
    // Extended With Currency

    // Extended With InvoiceDetail
    invoiceDetailDtos: [],
  };
  private _emptyInvoiceExtDtoErrors: InvoiceExtDtoErrors = {
    invoiceId: "",
    currencyId: "",
    buyerNameSurname: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerAddress: "",
    buyerIp: "",
    reservationStartDate: "",
    reservationEndDate: "",
    adult: "",
    child: "",
    childAge1: "",
    childAge2: "",
    childAge3: "",
    childAge4: "",
    childAge5: "",
    childAge6: "",
    title: "",
    netPrice: "",
    vat: "",
    totalVat: "",
    totalPrice: "",
    paid: "",
    canceled: "",
    createdAt: "",
    updatedAt: "",
    // Extended With InvoiceType
    // Extended With PaymentType
    // Extended With Currency

    // Extended With InvoiceDetail
    invoiceDetailDtos: "",
  };

  constructor(
    private http: HttpClient,
  ) {}

  public get emptyInvoiceDetailDto(): InvoiceDetailDto {
    return cloneDeep(this._emptyInvoiceDetailDto);
  }

  public get emptyInvoiceDetailDtoErrors(): InvoiceDetailDtoErrors {
    return cloneDeep(this._emptyInvoiceDetailDtoErrors);
  }

  public get emptyInvoiceExtDto(): InvoiceExtDto {
    return cloneDeep(this._emptyInvoiceExtDto);
  }

  public get emptyInvoiceExtDtoErrors(): InvoiceExtDtoErrors {
    return cloneDeep(this._emptyInvoiceExtDtoErrors);
  }

  add(invoiceExtDto: InvoiceExtDto): Observable<SingleDataResult<InvoiceExtDto>> {
    return this.http.post<SingleDataResult<InvoiceExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/add`, invoiceExtDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  getById(id: number): Observable<SingleDataResult<InvoiceExtDto>> {
    return this.http.get<SingleDataResult<InvoiceExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyid/${id}`);
  }

  getExts(): Observable<ListDataResult<InvoiceExtDto>> {
    return this.http.get<ListDataResult<InvoiceExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getexts`);
  }

  update(invoiceExtDto: InvoiceExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, invoiceExtDto);
  }
}
