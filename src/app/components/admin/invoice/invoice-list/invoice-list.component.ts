import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { InvoiceExtDto } from 'src/app/models/dtos/invoice-ext-dto';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent {

  @Input() invoiceExtDtos: InvoiceExtDto[] = [];

  @Output() selected = new EventEmitter<InvoiceExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("InvoiceListComponent constructor çalıştı.");
  }

  // Paginator'daki değişiklikleri tabloya uygular.
  onPageChange(currentPage: number): void {
    this.pageSize = this.itemsPerPage * (currentPage - 1);
    if(currentPage == 1){
      this.elementIndex = 0;
    } else {
      this.elementIndex = (currentPage - 1) * this.itemsPerPage;
    }
  }

  openEditPage(selectedInvoiceExtDto: InvoiceExtDto): void {
    this.selected.emit(cloneDeep(selectedInvoiceExtDto));
  }
}
