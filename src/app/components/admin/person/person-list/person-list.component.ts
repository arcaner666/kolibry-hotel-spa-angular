import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss']
})
export class PersonListComponent {

  @Input() personExtDtos: PersonExtDto[] = [];

  @Output() deleted = new EventEmitter<PersonExtDto>();
  @Output() selected = new EventEmitter<PersonExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    //console.log("PersonListComponent constructor çalıştı.");
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
  
  openDeleteModal(selectedPersonExtDto: PersonExtDto): void {
    this.deleted.emit(cloneDeep(selectedPersonExtDto));
  }

  openEditPage(selectedPersonExtDto: PersonExtDto): void {
    this.selected.emit(cloneDeep(selectedPersonExtDto));
  }
}
