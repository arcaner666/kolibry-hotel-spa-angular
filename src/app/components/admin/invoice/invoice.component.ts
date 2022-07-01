import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { InvoiceExtDto } from 'src/app/models/dtos/invoice-ext-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { CurrencyService } from 'src/app/services/currency.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public cardHeader: string = "Rezervasyon Detayları";
  public currencyDtos$!: Observable<ListDataResult<CurrencyDto>>;
  public invoiceExtDtos$!: Observable<ListDataResult<InvoiceExtDto>>;
  public selectedInvoiceExtDto: InvoiceExtDto;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private currencyService: CurrencyService,
    private invoiceService: InvoiceService,
  ) { 
    //console.log("InvoiceComponent constructor çalıştı.");

    this.selectedInvoiceExtDto = this.invoiceService.emptyInvoiceExtDto;

    this.currencyDtos$ = this.getCurrencies();
    this.invoiceExtDtos$ = this.getInvoiceExts();
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  getCurrencies(): Observable<ListDataResult<CurrencyDto>> {
    this.currencyDtos$ = this.currencyService.getAll();
    return this.currencyDtos$;
  }  

  getInvoiceExts(): Observable<ListDataResult<InvoiceExtDto>> {
    this.invoiceExtDtos$ = this.invoiceService.getExts();
    return this.invoiceExtDtos$;
  }

  select(selectedInvoiceExtDto: InvoiceExtDto): void {
    if (selectedInvoiceExtDto) {
      this.selectedInvoiceExtDto = selectedInvoiceExtDto;
    } else {
      this.selectedInvoiceExtDto = this.invoiceService.emptyInvoiceExtDto;  
    }
    this.activePage = "detail";
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
