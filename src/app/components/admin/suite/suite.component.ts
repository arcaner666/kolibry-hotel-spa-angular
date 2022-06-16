import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, tap, EMPTY, from, take, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SuiteDto } from 'src/app/models/dtos/suite-dto';
import { SuiteDtoErrors } from 'src/app/models/validation-errors/suite-dto-errors';

import { SuiteService } from 'src/app/services/suite.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-suite',
  templateUrl: './suite.component.html',
  styleUrls: ['./suite.component.scss']
})
export class SuiteComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public cardHeader: string = "";
  public loading: boolean = false;
  public selectedSuiteDto: SuiteDto;
  public selectedSuiteDtoErrors: SuiteDtoErrors;
  public suiteDtos$!: Observable<ListDataResult<SuiteDto>>;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private modalService: NgbModal,
    private suiteService: SuiteService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("SuiteComponent constructor çalıştı.");

    this.selectedSuiteDto = this.suiteService.emptySuiteDto;
    this.selectedSuiteDtoErrors = this.suiteService.emptySuiteDtoErrors;

    this.suiteDtos$ = this.getSuites();
  }

  add(): void {
    let [isModelValid, errors] = this.validationService.validateSuiteDtoForAdd(this.selectedSuiteDto);
    this.selectedSuiteDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.suiteService.add(this.selectedSuiteDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;
  
          return this.getSuites();
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
      console.log(this.selectedSuiteDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedSuiteDto: SuiteDto): void {
    this.selectedSuiteDto = selectedSuiteDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.suiteService.delete(selectedSuiteDto.suiteId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getSuites();
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

  getSuites(): Observable<ListDataResult<SuiteDto>> {
    this.suiteDtos$ = this.suiteService.getAll();
    return this.suiteDtos$;
  }

  save(selectedSuiteDto: SuiteDto): void {
    if (selectedSuiteDto.suiteId == 0) {
      this.add();
    } else {
      this.update();
    }
  }

  select(selectedSuiteDto: SuiteDto): void {
    if (selectedSuiteDto) {
      this.selectedSuiteDto = selectedSuiteDto;
    } else {
      this.selectedSuiteDto = this.suiteService.emptySuiteDto;  
    }
    this.setHeader(this.selectedSuiteDto.suiteId);
    this.activePage = "detail";
  }

  setHeader(suiteId: number): void {
    suiteId == 0 ? this.cardHeader = "Oda Ekle" : this.cardHeader = "Odayı Düzenle";
  }

  update(): void {
    let [isModelValid, errors] = this.validationService.validateSuiteDtoForAdd(this.selectedSuiteDto);
    this.selectedSuiteDtoErrors = errors;
    if (isModelValid) {
      this.suiteService.update(this.selectedSuiteDto)
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
      console.log(this.selectedSuiteDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
