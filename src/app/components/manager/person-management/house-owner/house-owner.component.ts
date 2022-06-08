import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY, from, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { HouseOwnerExtDtoErrors } from 'src/app/models/validation-errors/house-owner-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { RouteHistory } from 'src/app/models/various/route-history';

import { AccountService } from 'src/app/services/account.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { HouseOwnerService } from 'src/app/services/house-owner.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-house-owner',
  templateUrl: './house-owner.component.html',
  styleUrls: ['./house-owner.component.scss']
})
export class HouseOwnerComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public accountGroupDtos: AccountGroupDto[] = [];
  public activePage: string = "list";
  public cardHeader: string = "";
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public houseOwnerExtDtos$!: Observable<ListDataResult<HouseOwnerExtDto>>;
  public loading: boolean = false;
  public selectedHouseOwnerExtDto: HouseOwnerExtDto;
  public selectedHouseOwnerExtDtoErrors: HouseOwnerExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private accountService: AccountService,
    private accountGroupService: AccountGroupService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private houseOwnerService: HouseOwnerService,
    private modalService: NgbModal,
    private navigationService: NavigationService,
    private router: Router,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("HouseOwnerComponent constructor çalıştı.");

    this.selectedHouseOwnerExtDto = this.houseOwnerService.emptyHouseOwnerExtDto;
    this.selectedHouseOwnerExtDtoErrors = this.houseOwnerService.emptyHouseOwnerExtDtoErrors;

    this.getAllAccountGroups();
    this.branchDtos$ = this.getBranchsByBusinessId();

    this.navigate(this.navigationService.routeHistory);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedHouseOwnerExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateHouseOwnerExtDto(this.selectedHouseOwnerExtDto, "add");
    this.selectedHouseOwnerExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.houseOwnerService.addExt(this.selectedHouseOwnerExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.navigateOnCompletion(this.navigationService.routeHistory);
          window.scroll(0,0);
          this.loading = false;

          return this.getHouseOwnerExtsByBusinessId();
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
      console.log(this.selectedHouseOwnerExtDtoErrors);
    }
  }

  cancel(): void {
    this.navigateOnCompletion(this.navigationService.routeHistory);
    window.scroll(0,0);
  }

  delete(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.selectedHouseOwnerExtDto = selectedHouseOwnerExtDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.houseOwnerService.deleteExt(selectedHouseOwnerExtDto.houseOwnerId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getHouseOwnerExtsByBusinessId();
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

  generateAccountCode() {
    let [isModelValid, errors] = this.validationService.validateHouseOwnerExtDto(this.selectedHouseOwnerExtDto, "code");
    this.selectedHouseOwnerExtDtoErrors = errors;
    if (isModelValid) {      
      this.accountService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.selectedHouseOwnerExtDto.branchId, 
        "120")
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedHouseOwnerExtDto.accountOrder = response.data.accountOrder;
          this.selectedHouseOwnerExtDto.accountCode = response.data.accountCode;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedHouseOwnerExtDtoErrors);
    }
  }

  getAllAccountGroups(): void {
    this.accountGroupService.getAll()
    .pipe(
      takeUntil(this.unsubscribeAll),
    ).subscribe({
      next: (response) => {
        this.accountGroupDtos = response.data;
      }, error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
      }
    });
  }

  getBranchsByBusinessId(): Observable<ListDataResult<BranchDto>> {
    this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.branchDtos$;
  }

  getHouseOwnerExtsByBusinessId(): Observable<ListDataResult<HouseOwnerExtDto>> {
    this.houseOwnerExtDtos$ = this.houseOwnerService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.houseOwnerExtDtos$;
  }

  navigate(routeHistory: RouteHistory) {
    if (routeHistory.previousRoute != "") {
      if (routeHistory.accountId != 0) {
        this.houseOwnerService.getExtByAccountId(routeHistory.accountId)
        .pipe(
          takeUntil(this.unsubscribeAll),
        ).subscribe({
          next: (response) => {
            this.selectedHouseOwnerExtDto = response.data;
          }, error: (error) => {
            console.log(error);
            this.toastService.danger(error.message);
          }
        });
      }

      this.activePage = "detail";
    } else {
      this.houseOwnerExtDtos$ = this.getHouseOwnerExtsByBusinessId();
    }
  }

  navigateOnCompletion(routeHistory: RouteHistory) {
    if (routeHistory.previousRoute) {
      this.router.navigate([`${routeHistory.previousRoute}`]);
      this.navigationService.routeHistory = this.navigationService.emptyRouteHistory;
    } else {
      this.activePage = "list";
    }
  }

  save(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    if (selectedHouseOwnerExtDto.houseOwnerId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    if (selectedHouseOwnerExtDto) {
      this.selectedHouseOwnerExtDto = selectedHouseOwnerExtDto;
    } else {
      this.selectedHouseOwnerExtDto = this.houseOwnerService.emptyHouseOwnerExtDto;  
    }
    this.setHeader(this.selectedHouseOwnerExtDto.houseOwnerId);
    this.activePage = "detail";
  }

  setHeader(houseOwnerId: number): void {
    houseOwnerId == 0 ? this.cardHeader = "Mülk Sahibi Ekle" : this.cardHeader = "Mülk Sahibini Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateHouseOwnerExtDto(this.selectedHouseOwnerExtDto, "update");
    this.selectedHouseOwnerExtDtoErrors = errors;
    if (isModelValid) {
      this.houseOwnerService.updateExt(this.selectedHouseOwnerExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.navigateOnCompletion(this.navigationService.routeHistory);
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
      console.log(this.selectedHouseOwnerExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
