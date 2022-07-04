import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Subject, takeUntil, concatMap, Observable } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { InvoiceDetailDto } from 'src/app/models/dtos/invoice-detail-dto';
import { InvoiceDetailDtoErrors } from 'src/app/models/validation-errors/invoice-detail-dto-errors';
import { InvoiceExtDto } from 'src/app/models/dtos/invoice-ext-dto';
import { InvoiceExtDtoErrors } from 'src/app/models/validation-errors/invoice-ext-dto-errors';
import { PayTrIframeDto } from 'src/app/models/dtos/paytr-iframe-dto';
import { SingleDataResult } from 'src/app/models/results/single-data-result';
import { SuiteDto } from 'src/app/models/dtos/suite-dto';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { PayTrService } from 'src/app/services/paytr.service';
import { SuiteService } from 'src/app/services/suite.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  @ViewChild('paymentModal') paymentModal!: ElementRef;
  
  public cardHeader: string = "Rezervasyon";
  public clientIp: string = "";
  public currencyDtos: CurrencyDto[] = [];
  public iframeOpen: boolean = false;
  public iframeUrl: SafeUrl = "";
  public payTrIframeDto$!: Observable<SingleDataResult<PayTrIframeDto>>;
  public loading: boolean = false;
  public selectedCurrencyTitle: string = "";
  public selectedInvoiceDetailDto: InvoiceDetailDto;
  public selectedInvoiceDetailDtoErrors: InvoiceDetailDtoErrors;
  public selectedInvoiceDetailDtos: InvoiceDetailDto[] = [];
  public selectedInvoiceExtDto: InvoiceExtDto;
  public selectedInvoiceExtDtoErrors: InvoiceExtDtoErrors;
  public selectedPayTrIframeDto: PayTrIframeDto;
  public submitted: boolean = false;
  public suiteDtos: SuiteDto[] = [];
  
  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private currencyService: CurrencyService,
    private domSanitizer: DomSanitizer,
    private invoiceService: InvoiceService,
    private payTrService: PayTrService,
    private router: Router,
    private suiteService: SuiteService,
    private toastService: ToastService,
    private validationService: ValidationService,
    
    public breakpointService: BreakpointService,
  ) { 
    //console.log("ReservationComponent constructor çalıştı.");

    this.selectedInvoiceDetailDto = this.invoiceService.emptyInvoiceDetailDto;
    this.selectedInvoiceDetailDtoErrors = this.invoiceService.emptyInvoiceDetailDtoErrors;
    this.selectedInvoiceExtDto = this.invoiceService.emptyInvoiceExtDto;
    this.selectedInvoiceExtDtoErrors = this.invoiceService.emptyInvoiceExtDtoErrors;
    this.selectedPayTrIframeDto = this.payTrService.emptyPayTrIframeDto;

    this.getAllCurrencies();
    this.getAllSuites();
    this.getClientIp();
  }

  add(): void {
    this.selectedInvoiceExtDto.buyerIp = this.clientIp;
    this.submitted = true;
    let [isModelValid1, errors1] = this.validationService.validateInvoiceDetailDtoForAdd(this.selectedInvoiceDetailDto);
    let [isModelValid2, errors2] = this.validationService.validateInvoiceExtDtoForAdd(this.selectedInvoiceExtDto);
    this.selectedInvoiceDetailDtoErrors = errors1;
    this.selectedInvoiceExtDtoErrors = errors2;
    if (isModelValid1 && isModelValid2) {
      this.loading = true;

      this.invoiceService.add(this.selectedInvoiceExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.loading = false;

          return this.getIframeToken(response.data.invoiceId);
        }),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.loading = false;
          this.openIframe(response.data.iframeToken);

          this.selectedInvoiceDetailDto = this.invoiceService.emptyInvoiceDetailDto;
          this.selectedInvoiceDetailDtoErrors = this.invoiceService.emptyInvoiceDetailDtoErrors;
          this.selectedInvoiceExtDto = this.invoiceService.emptyInvoiceExtDto;
          this.selectedInvoiceExtDtoErrors = this.invoiceService.emptyInvoiceExtDtoErrors;
          this.selectedPayTrIframeDto = this.payTrService.emptyPayTrIframeDto;
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

  calculate(currencyId: number, suiteId: number, reservationStartDate: Date, reservationEndDate: Date) {
    const filteredCurrencyDto: CurrencyDto = this.currencyDtos.filter(c => c.currencyId == currencyId)[0];
    const filteredSuiteDto: SuiteDto = this.suiteDtos.filter(s => s.suiteId == suiteId)[0];
    const amount: number = this.dateDifferenceInDays(reservationStartDate, reservationEndDate);
    const price: number = Math.round(((filteredSuiteDto.price / filteredCurrencyDto.exchangeRate) + Number.EPSILON) * 100) / 100;
    const vat: number = filteredSuiteDto.vat;
    const totalVat: number = Math.round(((filteredSuiteDto.totalVat / filteredCurrencyDto.exchangeRate) + Number.EPSILON) * 100) / 100;
    const totalPrice: number = Math.round((((price + totalVat) * amount) + Number.EPSILON) * 100) / 100;
    this.selectedInvoiceDetailDto.amount = amount;
    this.selectedInvoiceDetailDto.price = price;
    this.selectedInvoiceDetailDto.vat = vat;
    this.selectedInvoiceDetailDto.totalVat = totalVat;
    this.selectedInvoiceDetailDto.totalPrice = totalPrice;

    this.selectedInvoiceExtDto.invoiceDetailDtos.push(this.selectedInvoiceDetailDto);

    let netPrice: number = 0;
    let totalVat2: number = 0;
    let totalPrice2: number = 0;
    this.selectedInvoiceExtDto.invoiceDetailDtos.forEach(
      (invoiceDetailDto: InvoiceDetailDto) => {
        netPrice += invoiceDetailDto.price * invoiceDetailDto.amount;
        totalVat2 += invoiceDetailDto.totalVat * invoiceDetailDto.amount;
      }
    );
    totalPrice2 = netPrice + totalVat2;

    this.selectedInvoiceExtDto.netPrice = netPrice;
    // Bu modelde KDV olmaması gerekiyor çünkü faturanın her bir satırının KDV oranı farklı olabilir. Fatura bazında KDV diye birşey yok. 
    // Yine de modelin çalışması için gerekiyor.
    this.selectedInvoiceExtDto.vat = vat;
    this.selectedInvoiceExtDto.totalVat = totalVat2;
    this.selectedInvoiceExtDto.totalPrice = totalPrice2;
  }

  cancel(): void {
    this.router.navigate(['/public/home']);
    this.scrollToTop();
  }

  openIframe(iframeToken: string): void {
    const dangerousIframeUrl = `https://www.paytr.com/odeme/guvenli/${iframeToken}`;
    this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(dangerousIframeUrl);
    this.iframeOpen = true;
    this.scrollToTop();
  }

  dateDifferenceInDays(startDate: Date, endDate: Date): number {
    const instantiatedStartDate = new Date(startDate);
    const instantiatedEndDate = new Date(endDate);
    const _MS_PER_DAY: number = 1000 * 60 * 60 * 24;

    // Zamanı ve zaman dilimini hesaplamada problem yaratmaması için tarihten çıkarıyoruz.
    const utc1 = Date.UTC(instantiatedStartDate.getFullYear(), instantiatedStartDate.getMonth(), instantiatedStartDate.getDate());
    const utc2 = Date.UTC(instantiatedEndDate.getFullYear(), instantiatedEndDate.getMonth(), instantiatedEndDate.getDate());

    const result: number = Math.floor((utc2 - utc1) / _MS_PER_DAY);

    return result;
  }

  getAllCurrencies(): void {
    this.currencyService.getAll()
    .pipe(
      takeUntil(this.unsubscribeAll),
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

  getClientIp(): void {
    this.payTrService.getClientIp()
    .pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe({
      next: (response) => {
        this.clientIp = response.ip;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getIframeToken(invoiceId: number): Observable<SingleDataResult<PayTrIframeDto>> {
    this.selectedPayTrIframeDto = this.payTrService.emptyPayTrIframeDto;

    this.selectedPayTrIframeDto.nameSurname = this.selectedInvoiceExtDto.buyerNameSurname;
    this.selectedPayTrIframeDto.email = this.selectedInvoiceExtDto.buyerEmail;
    this.selectedPayTrIframeDto.phone = this.selectedInvoiceExtDto.buyerPhone;
    this.selectedPayTrIframeDto.address = this.selectedInvoiceExtDto.buyerAddress;
    this.selectedPayTrIframeDto.paymentAmount = this.selectedInvoiceExtDto.totalPrice;
    this.selectedPayTrIframeDto.userBasket = this.selectedInvoiceExtDto.invoiceDetailDtos;
    this.selectedPayTrIframeDto.merchantOid = invoiceId.toString();
    this.selectedPayTrIframeDto.merchantOkUrl = "https://kolibryhotelspa.com/public/reservation-success";
    this.selectedPayTrIframeDto.merchantFailUrl = "https://kolibryhotelspa.com/public/reservation-fail";
    //this.selectedPayTrIframeDto.merchantOkUrl = "https://localhost:4200/public/reservation-success";
    //this.selectedPayTrIframeDto.merchantFailUrl = "https://localhost:4200/public/reservation-fail";
    this.selectedPayTrIframeDto.userIp = this.selectedInvoiceExtDto.buyerIp;

    // Şuan PayTR'de sadece TL ödeme açık olduğu için sadece TL göndereceğiz.
    this.selectedPayTrIframeDto.currency = "TL";
    // const filteredCurrencyDto: CurrencyDto = this.currencyDtos.filter(c => c.currencyId == this.selectedInvoiceExtDto.currencyId)[0];
    // if (filteredCurrencyDto.title = "Türk Lirası") {
    //   this.selectedPayTrIframeDto.currency = "TL";
    // } else if (filteredCurrencyDto.title = "Dollar") {
    //   this.selectedPayTrIframeDto.currency = "USD";
    // } else if (filteredCurrencyDto.title = "Euro") {
    //   this.selectedPayTrIframeDto.currency = "EUR";
    // }

    this.selectedPayTrIframeDto.language = "tr";

    this.payTrIframeDto$ = this.payTrService.getIframeToken(this.selectedPayTrIframeDto);
    return this.payTrIframeDto$;
  }

  reset(): void {
    // Döviz tipi değişikliklerinde sayılar çarpılarak katlanmasın diye sıfırlama yapıyoruz.
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

  resetAndCalculate(): void {
    this.reset();
    this.submitted = true;
    let [isModelValid1, errors1] = this.validationService.validateInvoiceDetailDtoForAdd(this.selectedInvoiceDetailDto);
    let [isModelValid2, errors2] = this.validationService.validateInvoiceExtDtoForAdd(this.selectedInvoiceExtDto);
    this.selectedInvoiceDetailDtoErrors = errors1;
    this.selectedInvoiceExtDtoErrors = errors2;
    if (isModelValid1 && isModelValid2) {
      this.calculate(
        this.selectedInvoiceExtDto.currencyId, 
        this.selectedInvoiceDetailDto.suiteId,
        this.selectedInvoiceExtDto.reservationStartDate,
        this.selectedInvoiceExtDto.reservationEndDate
      );
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedInvoiceDetailDtoErrors);
      console.log(this.selectedInvoiceExtDtoErrors);
    }
  }

  resetSuite(): void {
    this.selectedInvoiceDetailDto.suiteId = 0;
  }

  scrollToTop(): void {
    window.scroll(0,0);
  }

  selectCurrency(currencyId: number): void {
    this.resetSuite();
    const filteredCurrencyDto = this.currencyDtos.filter(c => c.currencyId == currencyId)[0];
    this.selectedCurrencyTitle = filteredCurrencyDto.title;
  }

  selectReservationStartDate(ngbDateStruct: NgbDateStruct): void {
    this.resetSuite();
    this.selectedInvoiceDetailDto.amount = this.dateDifferenceInDays(
      this.selectedInvoiceExtDto.reservationStartDate, 
      this.selectedInvoiceExtDto.reservationEndDate
    );
  }

  selectReservationEndDate(ngbDateStruct: NgbDateStruct): void {
    this.resetSuite();
    this.selectedInvoiceDetailDto.amount = this.dateDifferenceInDays(
      this.selectedInvoiceExtDto.reservationStartDate, 
      this.selectedInvoiceExtDto.reservationEndDate
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
