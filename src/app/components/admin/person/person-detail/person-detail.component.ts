import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';
import { PersonExtDtoErrors } from 'src/app/models/validation-errors/person-ext-dto-errors';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader!: string;
  @Input() loading!: boolean;
  @Input() selectedPersonExtDto!: PersonExtDto;
  @Input() selectedPersonExtDtoErrors!: PersonExtDtoErrors;
  
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<PersonExtDto>();
  
  public passwordTextType: boolean = false;
  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("PersonDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  // Şifre göstermeyi tetikler.
  togglePasswordTextType(): void {
    this.passwordTextType = !this.passwordTextType;
  }
  
  save(selectedPersonExtDto: PersonExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedPersonExtDto);
  }
}
