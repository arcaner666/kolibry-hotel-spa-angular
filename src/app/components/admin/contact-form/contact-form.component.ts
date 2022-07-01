import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, tap, EMPTY, from, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ContactFormDto } from 'src/app/models/dtos/contact-form-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { ContactFormService } from 'src/app/services/contact-form.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public cardHeader: string = "İletişim Formları";
  public contactFormDtos$!: Observable<ListDataResult<ContactFormDto>>;
  public loading: boolean = false;
  public selectedContactFormDto: ContactFormDto;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private contactFormService: ContactFormService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) { 
    //console.log("ContactFormComponent constructor çalıştı.");

    this.selectedContactFormDto = this.contactFormService.emptyContactFormDto;

    this.contactFormDtos$ = this.getContacts();
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedContactFormDto: ContactFormDto): void {
    this.selectedContactFormDto = selectedContactFormDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.contactFormService.delete(selectedContactFormDto.contactFormId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getContacts();
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

  getContacts(): Observable<ListDataResult<ContactFormDto>> {
    this.contactFormDtos$ = this.contactFormService.getAll();
    return this.contactFormDtos$;
  }

  select(selectedContactFormDto: ContactFormDto): void {
    if (selectedContactFormDto) {
      this.selectedContactFormDto = selectedContactFormDto;
    } else {
      this.selectedContactFormDto = this.contactFormService.emptyContactFormDto;  
    }
    this.activePage = "detail";
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
