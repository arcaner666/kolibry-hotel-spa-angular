import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subject, takeUntil} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';
import { PersonExtDtoErrors } from 'src/app/models/validation-errors/person-ext-dto-errors';
import { Result } from 'src/app/models/results/result';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PersonService } from 'src/app/services/person.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  @ViewChild('registrationModal') registrationModal!: ElementRef;

  public loading: boolean = false;
  public modalResult: string = "";
  public passwordTextType: boolean = false;
  public personExtDto: PersonExtDto;
  public personExtDtoErrors: PersonExtDtoErrors;
  public result: Result = {
    success: false, 
    message: "",
  };
  public submitted: boolean = false;

  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private personService: PersonService,
    private validationService: ValidationService,

    public breakpointService: BreakpointService
    ) {
    //console.log("RegisterComponent constructor çalıştı.");

    this.personExtDto = this.personService.emptyPersonExtDto;
    this.personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;
  }

  add(): void {
    this.submitted = true;
    let [isModelValid, errors] = this.validationService.validatePersonExtDtoForAdd(this.personExtDto);
    this.personExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.personService.add(this.personExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: () => {
          this.modalService.open(this.registrationModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then(() => {}).catch(() => {});
          this.loading = false;
        }, error: (error) => {
          console.log(error);
          // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
          this.result.success = error.success;
          this.result.message = error.message;
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.personExtDtoErrors);
    }
  }

  // Şifre göstermeyi tetikler.
  togglePasswordTextType(): void {
    this.passwordTextType = !this.passwordTextType;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
