import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { InvoiceExtDto } from 'src/app/models/dtos/invoice-ext-dto';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader!: string;
  @Input() currencyDtos!: CurrencyDto[];
  @Input() selectedInvoiceExtDto!: InvoiceExtDto;
  
  @Output() cancelled = new EventEmitter();
  
  constructor() {
    //console.log("InvoiceDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
