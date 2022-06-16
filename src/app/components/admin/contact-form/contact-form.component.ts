import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, tap, EMPTY, from, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ContactDto } from 'src/app/models/dtos/contact-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { ContactService } from 'src/app/services/contact.service';
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
  public contactDtos$!: Observable<ListDataResult<ContactDto>>;
  public loading: boolean = false;
  public selectedContactDto: ContactDto;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private contactService: ContactService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) { 
    console.log("ContactFormComponent constructor çalıştı.");

    this.selectedContactDto = this.contactService.emptyContactDto;

    this.contactDtos$ = this.getContacts();
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedContactDto: ContactDto): void {
    this.selectedContactDto = selectedContactDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.contactService.delete(selectedContactDto.contactId)
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
        console.log(response);
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

  getContacts(): Observable<ListDataResult<ContactDto>> {
    this.contactDtos$ = this.contactService.getAll();
    return this.contactDtos$;
  }

  select(selectedContactDto: ContactDto): void {
    if (selectedContactDto) {
      this.selectedContactDto = selectedContactDto;
    } else {
      this.selectedContactDto = this.contactService.emptyContactDto;  
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
