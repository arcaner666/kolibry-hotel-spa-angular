import { Component, OnInit, OnDestroy } from '@angular/core';

import { concatMap, Subject, takeUntil, throttleTime } from 'rxjs';

import { ContactDto } from 'src/app/models/dtos/contact-dto';
import { ContactDtoErrors } from 'src/app/models/validation-errors/contact-dto-errors';

import { ContactService } from 'src/app/services/contact.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  public contactDto: ContactDto;
  public contactDtoErrors: ContactDtoErrors;
  public loading: boolean = false;
  public submitted: boolean = false;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private contactService: ContactService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) {
    console.log("ContactComponent constructor çalıştı.");

    this.contactDto = this.contactService.emptyContactDto;
    this.contactDtoErrors = this.contactService.emptyContactDtoErrors;
  }

  save(contactDto: ContactDto): void {
    this.submitted = true;
    
    let [isModelValid, errors] = this.validationService.validateContactDtoForAdd(contactDto);
    this.contactDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.contactService.add(this.contactDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.loading = false;
          this.contactDto = this.contactService.emptyContactDto;
          this.contactDtoErrors = this.contactService.emptyContactDtoErrors;
        },
        error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.contactDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
