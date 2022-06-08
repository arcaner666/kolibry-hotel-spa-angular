import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, takeUntil} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { ModuleOption } from 'src/app/models/various/module-option';
import { RegisterSectionManagerDto } from 'src/app/models/dtos/register-section-manager-dto';
import { Result } from 'src/app/models/results/result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registrationModal') registrationModal: ElementRef | undefined;

  public cityDtos$!: Observable<ListDataResult<CityDto>>;
  public companyManagerForm: FormGroup;
  public districtDtos$!: Observable<ListDataResult<DistrictDto>>;
  public loadingCompanyManagerForm: boolean = false;
  public loadingSectionManagerForm: boolean = false;
  public registerSectionManagerDto: RegisterSectionManagerDto;
  public moduleForm: FormGroup;
  public moduleOptions: ModuleOption[] = [
    { id: 1, name: "Site Yönetimi" }, 
    { id: 2, name: "İşletme Yönetimi" }, 
    { id: 3, name: "Otel Yönetimi" },
  ];
  public modalResult: string = "";
  public result: Result = {
    success: false, 
    message: "",
  };
  public sectionManagerForm: FormGroup;
  public submittedCompanyManagerForm: boolean = false;
  public submittedSectionManagerForm: boolean = false;

  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private authorizationService: AuthorizationService,
    private cityService: CityService,
    private districtService: DistrictService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,

    public breakpointService: BreakpointService
    ) {
    console.log("RegisterComponent constructor çalıştı.");

    this.registerSectionManagerDto = this.authorizationService.emptyRegisterSectionManagerDto;
    
    this.cityDtos$ = this.getCities();

    // Modül formu oluşturulur.
    this.moduleForm = this.formBuilder.group({
      module: [1, [Validators.required]],
    });

    // Site yöneticisi kayıt formu oluşturulur.
    this.sectionManagerForm = this.formBuilder.group({
      nameSurname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      businessName: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      districtId: ['', [Validators.required]],
      addressText: ['', [Validators.required]],
      taxOffice: ['', [Validators.required]],
      taxNumber: ['', [Validators.required]],
      identityNumber: ['', [Validators.required]],
      userAgreement: [false, [Validators.requiredTrue]],
    });

    // İşletme yöneticisi kayıt formu oluşturulur.
    this.companyManagerForm = this.formBuilder.group({
      nameSurname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      businessName: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      districtId: ['', [Validators.required]],
      addressText: ['', [Validators.required]],
      taxOffice: ['', [Validators.required]],
      taxNumber: ['', [Validators.required]],
      identityNumber: ['', [Validators.required]],
      userAgreement: [false, [Validators.requiredTrue]],
    });
  }

  addCompanyManager(): void {
    this.submittedCompanyManagerForm = true;

    if (this.companyManagerForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.companyManagerForm);
      return;
    }

    this.loadingCompanyManagerForm = true;

    this.fillRegisterManagerDto(this.moduleForm.controls['module'].value);

    this.authorizationService.registerCompanyManager(this.registerSectionManagerDto)
    .pipe(
      takeUntil(this.unsubscribeAll),
    ).subscribe({
      next: () => {
        this.modalService.open(this.registrationModal, {
          ariaLabelledBy: 'modal-basic-title',
          centered: true
        }).result.then(() => {}).catch(() => {});
        this.loadingCompanyManagerForm = false;
      }, error: (error) => {
        console.log(error);
        // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
        this.result.success = error.success;
        this.result.message = error.message;
        this.loadingCompanyManagerForm = false;
      }
    });
  }
  
  addSectionManager(): void {
    this.submittedSectionManagerForm = true;

    this.result = { success: false, message: ""};

    if (this.sectionManagerForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.sectionManagerForm);
      return;
    }

    this.loadingSectionManagerForm = true;

    this.fillRegisterManagerDto(this.moduleForm.controls['module'].value);

    this.authorizationService.registerSectionManager(this.registerSectionManagerDto)
    .pipe(
      takeUntil(this.unsubscribeAll),
    ).subscribe({
      next: () => {
        this.modalService.open(this.registrationModal, {
          ariaLabelledBy: 'modal-basic-title',
          centered: true
        }).result.then(() => {}).catch(() => {});
        this.loadingSectionManagerForm = false;
      }, error: (error) => {
        console.log(error);
        // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
        this.result.success = error.success;
        this.result.message = error.message;
        this.loadingSectionManagerForm = false;
      }
    });
  }

  fillRegisterManagerDto(selectedModule: number): void {
    switch (selectedModule) {
      case 1:
        this.registerSectionManagerDto.nameSurname = this.sectionManagerForm.controls['nameSurname'].value;
        this.registerSectionManagerDto.phone = this.sectionManagerForm.controls['phone'].value.toString();
        this.registerSectionManagerDto.businessName = this.sectionManagerForm.controls['businessName'].value;
        this.registerSectionManagerDto.cityId = this.sectionManagerForm.controls['cityId'].value;
        this.registerSectionManagerDto.districtId = this.sectionManagerForm.controls['districtId'].value;
        this.registerSectionManagerDto.addressText = this.sectionManagerForm.controls['addressText'].value;
        this.registerSectionManagerDto.taxOffice = this.sectionManagerForm.controls['taxOffice'].value;
        this.registerSectionManagerDto.taxNumber = this.sectionManagerForm.controls['taxNumber'].value;
        this.registerSectionManagerDto.identityNumber = this.sectionManagerForm.controls['identityNumber'].value;
        break;
      case 2:
        this.registerSectionManagerDto.nameSurname = this.sectionManagerForm.controls['nameSurname'].value;
        this.registerSectionManagerDto.phone = this.sectionManagerForm.controls['phone'].value.toString();
        this.registerSectionManagerDto.businessName = this.sectionManagerForm.controls['businessName'].value;
        this.registerSectionManagerDto.cityId = this.sectionManagerForm.controls['cityId'].value;
        this.registerSectionManagerDto.districtId = this.sectionManagerForm.controls['districtId'].value;
        this.registerSectionManagerDto.addressText = this.sectionManagerForm.controls['addressText'].value;
        this.registerSectionManagerDto.taxOffice = this.sectionManagerForm.controls['taxOffice'].value;
        this.registerSectionManagerDto.taxNumber = this.sectionManagerForm.controls['taxNumber'].value;
        this.registerSectionManagerDto.identityNumber = this.sectionManagerForm.controls['identityNumber'].value;
        break;
      default:
        break;
    }
  }

  getCities(): Observable<ListDataResult<CityDto>> {
    return this.cityService.getAll();
  }

  getDistrictsByCityId(cityId: number): Observable<ListDataResult<DistrictDto>> {
    return this.districtService.getByCityId(cityId);
  }

  selectCity(cityId: number): void {
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.registerSectionManagerDto.districtId = 0;
    this.sectionManagerForm.controls['districtId'].setValue(0);

    this.districtDtos$ = this.getDistrictsByCityId(cityId);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
