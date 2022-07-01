import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { ContactFormDto } from 'src/app/models/dtos/contact-form-dto';

@Component({
  selector: 'app-contact-form-list',
  templateUrl: './contact-form-list.component.html',
  styleUrls: ['./contact-form-list.component.scss']
})
export class ContactFormListComponent {

  @Input() contactFormDtos: ContactFormDto[] = [];

  @Output() deleted = new EventEmitter<ContactFormDto>();
  @Output() selected = new EventEmitter<ContactFormDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    //console.log("ContactFormListComponent constructor çalıştı.");
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

  openAddPage(): void {
    this.selected.emit();
  }
  
  openDeleteModal(selectedContactFormDto: ContactFormDto): void {
    this.deleted.emit(cloneDeep(selectedContactFormDto));
  }

  openEditPage(selectedContactFormDto: ContactFormDto): void {
    this.selected.emit(cloneDeep(selectedContactFormDto));
  }
}
