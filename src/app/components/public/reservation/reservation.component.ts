import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { InvoiceDetailDto } from 'src/app/models/dtos/invoice-detail-dto';
import { InvoiceDetailDtoErrors } from 'src/app/models/validation-errors/invoice-detail-dto-errors';
import { InvoiceExtDto } from 'src/app/models/dtos/invoice-ext-dto';
import { InvoiceExtDtoErrors } from 'src/app/models/validation-errors/invoice-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SuiteDto } from 'src/app/models/dtos/suite-dto';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SuiteService } from 'src/app/services/suite.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  public cardHeader: string = "Rezervasyon";
  public currencyDtos: CurrencyDto[] = [];
  public loading: boolean = false;
  public selectedInvoiceDetailDto: InvoiceDetailDto;
  public selectedInvoiceDetailDtoErrors: InvoiceDetailDtoErrors;
  public selectedInvoiceDetailDtos: InvoiceDetailDto[] = [];
  public selectedInvoiceExtDto: InvoiceExtDto;
  public selectedInvoiceExtDtoErrors: InvoiceExtDtoErrors;
  public submitted: boolean = false;
  public suiteDtos: SuiteDto[] = [];
  
  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private currencyService: CurrencyService,
    private invoiceService: InvoiceService,
    private router: Router,
    private suiteService: SuiteService,
    private toastService: ToastService,
    private validationService: ValidationService,
    
    public breakpointService: BreakpointService,
  ) { 
    console.log("ReservationComponent constructor çalıştı.");

    this.selectedInvoiceDetailDto = this.invoiceService.emptyInvoiceDetailDto;
    this.selectedInvoiceDetailDtoErrors = this.invoiceService.emptyInvoiceDetailDtoErrors;
    this.selectedInvoiceExtDto = this.invoiceService.emptyInvoiceExtDto;
    this.selectedInvoiceExtDtoErrors = this.invoiceService.emptyInvoiceExtDtoErrors;

    this.getAllCurrencies();
    this.getAllSuites();
  }

  add(): void {
    this.submitted = true;
    console.log(this.selectedInvoiceExtDto);
    let [isModelValid1, errors1] = this.validationService.validateInvoiceDetailDtoForAdd(this.selectedInvoiceDetailDto);
    let [isModelValid2, errors2] = this.validationService.validateInvoiceExtDtoForAdd(this.selectedInvoiceExtDto);
    this.selectedInvoiceDetailDtoErrors = errors1;
    this.selectedInvoiceExtDtoErrors = errors2;
    if (isModelValid1 && isModelValid2) {
      this.loading = true;

      this.invoiceService.add(this.selectedInvoiceExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.loading = false;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedInvoiceDetailDtoErrors);
      console.log(this.selectedInvoiceExtDtoErrors);
    }
  }

  calculatePrice(currencyId: number, suiteId: number, reservationStartDate: Date, reservationEndDate: Date) {
    const filteredCurrencyDto = this.currencyDtos.filter(c => c.currencyId == currencyId)[0];
    const filteredSuiteDto = this.suiteDtos.filter(s => s.suiteId == suiteId)[0];
    this.selectedInvoiceDetailDto.amount = this.dateDifferenceInDays(reservationStartDate, reservationEndDate);
    this.selectedInvoiceDetailDto.price = Math.round(((filteredSuiteDto.price / filteredCurrencyDto.exchangeRate) + Number.EPSILON) * 100) / 100;
    this.selectedInvoiceDetailDto.vat = filteredSuiteDto.vat;
    this.selectedInvoiceDetailDto.totalVat = Math.round(((filteredSuiteDto.totalVat / filteredCurrencyDto.exchangeRate) + Number.EPSILON) * 100) / 100;
    this.selectedInvoiceDetailDto.totalPrice = Math.round((((this.selectedInvoiceDetailDto.price + this.selectedInvoiceDetailDto.totalVat) * this.selectedInvoiceDetailDto.amount) + Number.EPSILON) * 100) / 100;
    
    this.selectedInvoiceExtDto.invoiceDetailDtos.push(this.selectedInvoiceDetailDto);

    this.selectedInvoiceExtDto.invoiceDetailDtos.forEach(
      (invoiceDetailDto) => {
        this.selectedInvoiceExtDto.netPrice += invoiceDetailDto.price;
        this.selectedInvoiceExtDto.totalVat += invoiceDetailDto.totalVat;
      }
    );
    this.selectedInvoiceExtDto.totalPrice = this.selectedInvoiceExtDto.netPrice + this.selectedInvoiceExtDto.totalVat;
    console.log(this.selectedInvoiceExtDto.totalPrice);
  }

  cancel(): void {
    this.router.navigate(['/public/home']);
    window.scroll(0,0);
  }

  dateDifferenceInDays(startDate: Date, endDate: Date): number {
    const instantiatedStartDate = new Date(startDate);
    const instantiatedEndDate = new Date(endDate);
    const _MS_PER_DAY: number = 1000 * 60 * 60 * 24;

    // Zamanı ve zaman dilimini hesaplamada problem yaratmaması için tarihten çıkarıyoruz.
    const utc1 = Date.UTC(instantiatedStartDate.getFullYear(), instantiatedStartDate.getMonth(), instantiatedStartDate.getDate());
    const utc2 = Date.UTC(instantiatedEndDate.getFullYear(), instantiatedEndDate.getMonth(), instantiatedEndDate.getDate());

    const result: number = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    console.log("DateDifference" + result);
    return result;
  }

  getAllCurrencies(): void {
    this.currencyService.getAll()
    .pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe({
      next: (response) => {
        this.currencyDtos = response.data;
      }, error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
      }
    });
  }

  getAllSuites(): void {
    this.suiteService.getAll()
    .pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe({
      next: (response) => {
        this.suiteDtos = response.data;
      }, error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
      }
    });
  }

  resetCalculations(): void {
    // Döviz tipi değişikliklerinde sayılar çarpılarak katlanmasın diye sıfırlama yapıyoruz.
    this.selectedInvoiceDetailDto.amount = 0;
    this.selectedInvoiceDetailDto.price = 0;
    this.selectedInvoiceDetailDto.vat = 0;
    this.selectedInvoiceDetailDto.totalVat = 0;
    this.selectedInvoiceDetailDto.totalPrice = 0;

    this.selectedInvoiceExtDto.invoiceDetailDtos = [];
    this.selectedInvoiceExtDto.netPrice = 0;
    this.selectedInvoiceExtDto.vat = 0;
    this.selectedInvoiceExtDto.totalVat = 0;
    this.selectedInvoiceExtDto.totalPrice = 0;
  }

  resetModelsAndCalculate(): void {
    this.resetCalculations();
    if (this.selectedInvoiceExtDto.currencyId != 0 &&
      this.selectedInvoiceDetailDto.suiteId != 0 &&
      this.selectedInvoiceExtDto.reservationStartDate &&
      this.selectedInvoiceExtDto.reservationEndDate) {
      this.calculatePrice(
        this.selectedInvoiceExtDto.currencyId, 
        this.selectedInvoiceDetailDto.suiteId, 
        this.selectedInvoiceExtDto.reservationStartDate, 
        this.selectedInvoiceExtDto.reservationEndDate
      );
    }
  }

  selectReservationStartDate(): void {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
