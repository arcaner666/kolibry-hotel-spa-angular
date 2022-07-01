import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { ContactFormDto } from 'src/app/models/dtos/contact-form-dto';
import { ContactFormDtoErrors } from 'src/app/models/validation-errors/contact-form-dto-errors';

import { ContactFormService } from 'src/app/services/contact-form.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  public contactFormDto: ContactFormDto;
  public contactFormDtoErrors: ContactFormDtoErrors;
  public loading: boolean = false;
  public submitted: boolean = false;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private contactFormService: ContactFormService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) {
    //console.log("ContactComponent constructor çalıştı.");

    this.contactFormDto = this.contactFormService.emptyContactFormDto;
    this.contactFormDtoErrors = this.contactFormService.emptyContactFormDtoErrors;
  }

  save(contactFormDto: ContactFormDto): void {
    this.submitted = true;
    
    let [isModelValid, errors] = this.validationService.validateContactFormDtoForAdd(contactFormDto);
    this.contactFormDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.contactFormService.add(this.contactFormDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.loading = false;
          this.contactFormDto = this.contactFormService.emptyContactFormDto;
          this.contactFormDtoErrors = this.contactFormService.emptyContactFormDtoErrors;
        },
        error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.contactFormDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
