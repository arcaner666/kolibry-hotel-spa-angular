import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';

@Component({
  selector: 'app-section-group-list',
  templateUrl: './section-group-list.component.html',
  styleUrls: ['./section-group-list.component.scss']
})
export class SectionGroupListComponent {

  @Input() sectionGroupDtos: SectionGroupDto[] = [];

  @Output() deleted = new EventEmitter<SectionGroupDto>();
  @Output() selected = new EventEmitter<SectionGroupDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("SectionGroupListComponent constructor çalıştı.");
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
  
  openDeleteModal(selectedSectionGroupDto: SectionGroupDto): void {
    this.deleted.emit(cloneDeep(selectedSectionGroupDto));
  }

  openEditPage(selectedSectionGroupDto: SectionGroupDto): void {
    this.selected.emit(cloneDeep(selectedSectionGroupDto));
  }
}
