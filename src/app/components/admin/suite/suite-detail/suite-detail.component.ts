import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SuiteDto } from 'src/app/models/dtos/suite-dto';
import { SuiteDtoErrors } from 'src/app/models/validation-errors/suite-dto-errors';

@Component({
  selector: 'app-suite-detail',
  templateUrl: './suite-detail.component.html',
  styleUrls: ['./suite-detail.component.scss']
})
export class SuiteDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader!: string;
  @Input() loading!: boolean;
  @Input() selectedSuiteDto!: SuiteDto;
  @Input() selectedSuiteDtoErrors!: SuiteDtoErrors;
  
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<SuiteDto>();
  
  public submitted: boolean = false;
  
  constructor() {
    //console.log("SuiteDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedSuiteDto: SuiteDto): void {
    this.submitted = true;
    this.saved.emit(selectedSuiteDto);
  }
}
