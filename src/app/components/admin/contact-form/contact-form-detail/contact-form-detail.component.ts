import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ContactDto } from 'src/app/models/dtos/contact-dto';

@Component({
  selector: 'app-contact-form-detail',
  templateUrl: './contact-form-detail.component.html',
  styleUrls: ['./contact-form-detail.component.scss']
})
export class ContactFormDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader!: string;
  @Input() loading!: boolean;
  @Input() selectedContactDto!: ContactDto;
  
  @Output() cancelled = new EventEmitter();
  
  public passwordTextType: boolean = false;
  
  constructor(

  ) {
    console.log("ContactFormDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  // Şifre göstermeyi tetikler.
  togglePasswordTextType(): void {
    this.passwordTextType = !this.passwordTextType;
  }
}
