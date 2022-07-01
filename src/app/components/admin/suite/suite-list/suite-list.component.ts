import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { SuiteDto } from 'src/app/models/dtos/suite-dto';

@Component({
  selector: 'app-suite-list',
  templateUrl: './suite-list.component.html',
  styleUrls: ['./suite-list.component.scss']
})
export class SuiteListComponent {

  @Input() suiteDtos: SuiteDto[] = [];

  @Output() deleted = new EventEmitter<SuiteDto>();
  @Output() selected = new EventEmitter<SuiteDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    //console.log("SuiteListComponent constructor çalıştı.");
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
  
  openDeleteModal(selectedSuiteDto: SuiteDto): void {
    this.deleted.emit(cloneDeep(selectedSuiteDto));
  }

  openEditPage(selectedSuiteDto: SuiteDto): void {
    this.selected.emit(cloneDeep(selectedSuiteDto));
  }
}
