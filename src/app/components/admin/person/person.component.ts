import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY, from, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';
import { PersonExtDtoErrors } from 'src/app/models/validation-errors/person-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { PersonService } from 'src/app/services/person.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public cardHeader: string = "";
  public personExtDtos$!: Observable<ListDataResult<PersonExtDto>>;
  public loading: boolean = false;
  public selectedPersonExtDto: PersonExtDto;
  public selectedPersonExtDtoErrors: PersonExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private personService: PersonService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    //console.log("PersonComponent constructor çalıştı.");

    this.selectedPersonExtDto = this.personService.emptyPersonExtDto;
    this.selectedPersonExtDtoErrors = this.personService.emptyPersonExtDtoErrors;

    this.personExtDtos$ = this.getPersonExts();
  }

  add(): void {
    let [isModelValid, errors] = this.validationService.validatePersonExtDtoForAdd(this.selectedPersonExtDto);
    this.selectedPersonExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.personService.add(this.selectedPersonExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;
  
          return this.getPersonExts();
        }
      )).subscribe({
        error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedPersonExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedPersonExtDto: PersonExtDto): void {
    this.selectedPersonExtDto = selectedPersonExtDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.personService.delete(selectedPersonExtDto.personId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getPersonExts();
      })
    ).subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.loading = false;
      }, error: (error) => {
        console.log(error);
        if (error != "cancel") {
          this.toastService.danger(error.message);
        }
        this.loading = false;
      }
    });
  }

  getPersonExts(): Observable<ListDataResult<PersonExtDto>> {
    this.personExtDtos$ = this.personService.getExts();
    return this.personExtDtos$;
  }

  save(selectedPersonExtDto: PersonExtDto): void {
    if (selectedPersonExtDto.personId == 0) {
      this.add();
    } else {
      this.update();
    }
  }

  select(selectedPersonExtDto: PersonExtDto): void {
    if (selectedPersonExtDto) {
      this.selectedPersonExtDto = selectedPersonExtDto;
    } else {
      this.selectedPersonExtDto = this.personService.emptyPersonExtDto;  
    }
    this.setHeader(this.selectedPersonExtDto.personId);
    this.activePage = "detail";
  }

  setHeader(personId: number): void {
    personId == 0 ? this.cardHeader = "Kişi Ekle" : this.cardHeader = "Kişiyi Düzenle";
  }

  update(): void {
    let [isModelValid, errors] = this.validationService.validatePersonExtDtoForUpdate(this.selectedPersonExtDto);
    this.selectedPersonExtDtoErrors = errors;
    if (isModelValid) {
      this.personService.update(this.selectedPersonExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedPersonExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
