import { Injectable } from '@angular/core';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { ApartmentExtDtoErrors } from 'src/app/models/validation-errors/apartment-ext-dto-errors';
import { BankExtDto } from 'src/app/models/dtos/bank-ext-dto';
import { BankExtDtoErrors } from 'src/app/models/validation-errors/bank-ext-dto-errors';
import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { BranchExtDtoErrors } from 'src/app/models/validation-errors/branch-ext-dto-errors';
import { CashExtDto } from 'src/app/models/dtos/cash-ext-dto';
import { CashExtDtoErrors } from 'src/app/models/validation-errors/cash-ext-dto-errors';
import { EmployeeExtDto } from 'src/app/models/dtos/employee-ext-dto';
import { EmployeeExtDtoErrors } from 'src/app/models/validation-errors/employee-ext-dto-errors';
import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { FlatExtDtoErrors } from 'src/app/models/validation-errors/flat-ext-dto-errors';
import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { HouseOwnerExtDtoErrors } from 'src/app/models/validation-errors/house-owner-ext-dto-errors';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SectionExtDtoErrors } from 'src/app/models/validation-errors/section-ext-dto-errors';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';
import { SectionGroupDtoErrors } from 'src/app/models/validation-errors/section-group-dto-errors';
import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';
import { TenantExtDtoErrors } from 'src/app/models/validation-errors/tenant-ext-dto-errors';

import { AccountService } from 'src/app/services/account.service';
import { ApartmentService } from 'src/app/services/apartment.service';
import { BankService } from 'src/app/services/bank.service';
import { BranchService } from 'src/app/services/branch.service';
import { CashService } from 'src/app/services/cash.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { FlatService } from 'src/app/services/flat.service';
import { HouseOwnerService } from 'src/app/services/house-owner.service';
import { SectionService } from 'src/app/services/section.service';
import { SectionGroupService } from 'src/app/services/section-group.service';
import { TenantService } from 'src/app/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(
    private accountService: AccountService,
    private apartmentService: ApartmentService,
    private bankService: BankService,
    private branchService: BranchService,
    private cashService: CashService,
    private employeeService: EmployeeService,
    private flatService: FlatService,
    private houseOwnerService: HouseOwnerService,
    private sectionService: SectionService,
    private sectionGroupService: SectionGroupService,
    private tenantService: TenantService,
  ) {}

  // Validasyon başarılıysa true, başarısız olursa false dönmeli.

  // Validasyon Tipleri
  bigint(value: number | undefined | null): boolean {
    // Bu metotta verilen aralık .NET'teki bigint tipi için değil Javascript'teki number tipi içindir. 
    // Çünkü .NET'teki bigint tipinin aralığı daha geniştir.
    return (value == undefined || value == null || value < -9007199254740991 || value > 9007199254740991 ? false : true);
  }
  
  bigintPositive(value: number | undefined | null): boolean {
    // Bu metotta verilen aralık .NET'teki bigint tipi için değil Javascript'teki number tipi içindir. 
    // Çünkü .NET'teki bigint tipinin aralığı daha geniştir.
    return (value == undefined || value == null || value <= 0 || value > 9007199254740991 ? false : true);
  }

  date(value: Date | undefined | null): boolean {
    return (value == undefined || value == null ? false : true);
  }

  dateInPast(value: Date | undefined | null): boolean {
    return (value == undefined || value == null || new Date(value).valueOf() > Date.now().valueOf() ? false : true);
  }

  int(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value < -2147483648 || value > 2147483647 ? false : true);
  }

  intPositive(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value <= 0 || value > 2147483647 ? false : true);
  }

  money(value: number | undefined | null): boolean {
    // Bu metotta verilen aralık .NET'teki money tipi için değil Javascript'teki number tipi içindir. 
    // Javascript'teki number tipi virgül ve sonrası dahil maksimum 16 karakterden oluşabiliyor. 
    // Alttaki sayıdan daha büyük her sayıyı yuvarlamaya başlıyor. Ondalık kısım da money tipi sebebiyle maksimum 4 karakter olabiliyor.
    return (value == undefined || value == null || value <= 0 || value > 99999999999.9999 ? false : true);
  }                                                                      

  numberPreciseLength(value: number | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.toString().length != length ? false : true);
  }

  range(value: number | undefined | null, minValue: number, maxValue: number): boolean {
    return (value == undefined || value == null || value < minValue || value > maxValue ? false : true);
  }

  smallint(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value < -32768 || value > 32767 ? false : true);
  }

  smallintPositive(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value <= 0 || value > 32767 ? false : true);
  }

  smallmoney(value: number | undefined | null): boolean {
    // Bu metotta verilen aralık .NET'teki smallmoney tipi için değil Javascript'teki number tipi içindir. 
    // Javascript'teki number tipi virgül ve sonrası dahil maksimum 16 karakterden oluşabiliyor. 
    // Alttaki sayıdan daha büyük her sayıyı yuvarlamaya başlıyor. Ondalık kısım da smallmoney tipi sebebiyle maksimum 4 karakter olabiliyor.
    return (value == undefined || value == null || value <= 0 || value > 214748.3647 ? false : true);
  }

  string(value: string | undefined | null): boolean {
    return (value == undefined || value == null || value == "" ? false : true);
  }

  stringPreciseLength(value: string | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.length != length ? false : true);
  }

  tinyint(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value <= 0 || value > 255 ? false : true);
  }

  // Kurallar
  validateAccountExtDto(accountExtDto: AccountExtDto, validationType: string): [boolean, AccountExtDtoErrors] {
    let accountExtDtoErrors = this.accountService.emptyAccountExtDtoErrors;  
    let isValid: boolean = true;

    const accountGroupId: boolean = this.smallintPositive(accountExtDto.accountGroupId);
    if (!accountGroupId && validationType == "add" || 
    !accountGroupId && validationType == "code")
      accountExtDtoErrors.accountGroupId = "Lütfen hesap grubu seçiniz.";
    
    const branchId: boolean = this.bigintPositive(accountExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      accountExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(accountExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      accountExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(accountExtDto.accountCode);
    if (!accountCode && validationType == "add")
      accountExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";

    const limit: boolean = this.money(accountExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      accountExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";

    for (const key in accountExtDtoErrors) {
      if (accountExtDtoErrors[key as keyof AccountExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, accountExtDtoErrors];
  }

  validateApartmentExtDto(apartmentExtDto: ApartmentExtDto, validationType: string): [boolean, ApartmentExtDtoErrors] {
    let apartmentExtDtoErrors = this.apartmentService.emptyApartmentExtDtoErrors;  
    let isValid: boolean = true;

    const sectionId: boolean = this.intPositive(apartmentExtDto.sectionId);
    if (!sectionId && validationType == "add")
      apartmentExtDtoErrors.sectionId = "Lütfen site seçiniz.";

    const managerId: boolean = this.bigintPositive(apartmentExtDto.managerId);
    if (!managerId && validationType == "add" || 
    !managerId && validationType == "update")
      apartmentExtDtoErrors.managerId = "Lütfen yönetici seçiniz.";
      
    const apartmentName: boolean = this.string(apartmentExtDto.apartmentName);
    if (!apartmentName && validationType == "add" || 
    !apartmentName && validationType == "update")
      apartmentExtDtoErrors.apartmentName = "Lütfen apartman adı giriniz.";

    const blockNumber: boolean = this.intPositive(apartmentExtDto.blockNumber);
    if (!blockNumber && validationType == "add" || 
    !blockNumber && validationType == "update")
      apartmentExtDtoErrors.blockNumber = "Lütfen blok numarası giriniz.";

    for (const key in apartmentExtDtoErrors) {
      if (apartmentExtDtoErrors[key as keyof ApartmentExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, apartmentExtDtoErrors];
  }

  validateBankExtDto(bankExtDto: BankExtDto, validationType: string): [boolean, BankExtDtoErrors] {
    let bankExtDtoErrors = this.bankService.emptyBankExtDtoErrors;  
    let isValid: boolean = true;

    const branchId: boolean = this.bigintPositive(bankExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      bankExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(bankExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      bankExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(bankExtDto.accountCode);
    if (!accountCode && validationType == "add")
      bankExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";

    const limit: boolean = this.money(bankExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      bankExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";

    const standartMaturity: boolean = this.smallintPositive(bankExtDto.standartMaturity);
    if (!standartMaturity && validationType == "add" || 
    !standartMaturity && validationType == "update")
      bankExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";
    
    const currencyId: boolean = this.tinyint(bankExtDto.currencyId);
    if (!currencyId && validationType == "add")
      bankExtDtoErrors.currencyId = "Lütfen döviz tipi seçiniz.";
    
    const bankName: boolean = this.string(bankExtDto.bankName);
    if (!bankName && validationType == "add" || 
    !bankName && validationType == "update")
      bankExtDtoErrors.bankName = "Lütfen banka adı giriniz.";

    const bankBranchName: boolean = this.string(bankExtDto.bankBranchName);
    if (!bankBranchName && validationType == "add" || 
    !bankBranchName && validationType == "update")
      bankExtDtoErrors.bankBranchName = "Lütfen banka şube adı giriniz.";

    const bankCode: boolean = this.string(bankExtDto.bankCode);
    if (!bankCode && validationType == "add" || 
    !bankCode && validationType == "update")
      bankExtDtoErrors.bankCode = "Lütfen banka kodu giriniz.";

    const bankBranchCode: boolean = this.string(bankExtDto.bankBranchCode);
    if (!bankBranchCode && validationType == "add" || 
    !bankBranchCode && validationType == "update")
      bankExtDtoErrors.bankBranchCode = "Lütfen banka şube kodu giriniz.";

    const bankAccountCode: boolean = this.string(bankExtDto.bankAccountCode);
    if (!bankAccountCode && validationType == "add" || 
    !bankAccountCode && validationType == "update")
      bankExtDtoErrors.bankAccountCode = "Lütfen banka hesap numarası giriniz.";

    const iban: boolean = this.string(bankExtDto.iban);
    if (!iban && validationType == "add" || 
    !iban && validationType == "update")
      bankExtDtoErrors.iban = "Lütfen IBAN giriniz.";

    const officerName: boolean = this.string(bankExtDto.officerName);
    if (!officerName && validationType == "add" || 
    !officerName && validationType == "update")
      bankExtDtoErrors.officerName = "Lütfen yetkili adı giriniz.";
    
    const cityId: boolean = this.smallintPositive(bankExtDto.cityId);
    if (!cityId && validationType == "add" || 
    !cityId && validationType == "update")
      bankExtDtoErrors.cityId = "Lütfen şehir seçiniz.";

    const districtId: boolean = this.intPositive(bankExtDto.districtId);
    if (!districtId && validationType == "add" || 
    !districtId && validationType == "update")
      bankExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";

    const addressText: boolean = this.string(bankExtDto.addressText);
    if (!addressText && validationType == "add" || 
    !addressText && validationType == "update")
      bankExtDtoErrors.addressText = "Lütfen adres giriniz.";
      
    for (const key in bankExtDtoErrors) {
      if (bankExtDtoErrors[key as keyof BankExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, bankExtDtoErrors];
  }

  validateBranchExtDto(branchExtDto: BranchExtDto, validationType: string): [boolean, BranchExtDtoErrors] {
    let branchExtDtoErrors = this.branchService.emptyBranchExtDtoErrors;  
    let isValid: boolean = true;

    const branchName: boolean = this.string(branchExtDto.branchName);
    if (!branchName && validationType == "add" || 
    !branchName && validationType == "update")
      branchExtDtoErrors.branchName = "Lütfen şube adı giriniz.";

    const branchCode: boolean = this.string(branchExtDto.branchCode);
    if (!branchCode && validationType == "add")
      branchExtDtoErrors.branchCode = "Lütfen şube kodu oluşturunuz.";
      
    const cityId: boolean = this.smallintPositive(branchExtDto.cityId);
    if (!cityId && validationType == "add" || 
    !cityId && validationType == "update")
      branchExtDtoErrors.cityId = "Lütfen şehir seçiniz.";

    const districtId: boolean = this.intPositive(branchExtDto.districtId);
    if (!districtId && validationType == "add" || 
    !districtId && validationType == "update")
      branchExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";

    const addressTitle: boolean = this.string(branchExtDto.addressTitle);
    if (!addressTitle && validationType == "add" || 
    !addressTitle && validationType == "update")
      branchExtDtoErrors.addressTitle = "Lütfen adres başlığı giriniz.";
    
    const postalCode: boolean = this.intPositive(branchExtDto.postalCode);
    if (!postalCode && validationType == "add" || 
    !postalCode && validationType == "update")
      branchExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";

    const addressText: boolean = this.string(branchExtDto.addressText);
    if (!addressText && validationType == "add" || 
    !addressText && validationType == "update")
      branchExtDtoErrors.addressText = "Lütfen adres giriniz.";

    for (const key in branchExtDtoErrors) {
      if (branchExtDtoErrors[key as keyof BranchExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, branchExtDtoErrors];
  }

  validateCashExtDto(cashExtDto: CashExtDto, validationType: string): [boolean, CashExtDtoErrors] {
    let cashExtDtoErrors = this.cashService.emptyCashExtDtoErrors;  
    let isValid: boolean = true;

    const branchId: boolean = this.bigintPositive(cashExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      cashExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(cashExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      cashExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(cashExtDto.accountCode);
    if (!accountCode && validationType == "add")
      cashExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";

    const limit: boolean = this.money(cashExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      cashExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";

    const currencyId: boolean = this.tinyint(cashExtDto.currencyId);
    if (!currencyId && validationType == "add")
      cashExtDtoErrors.currencyId = "Lütfen döviz tipi seçiniz.";
      
    for (const key in cashExtDtoErrors) {
      if (cashExtDtoErrors[key as keyof CashExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, cashExtDtoErrors];
  }

  validateEmployeeExtDto(employeeExtDto: EmployeeExtDto, validationType: string): [boolean, EmployeeExtDtoErrors] {
    let employeeExtDtoErrors = this.employeeService.emptyEmployeeExtDtoErrors;  
    let isValid: boolean = true;

    const nameSurname: boolean = this.string(employeeExtDto.nameSurname);
    if (!nameSurname && validationType == "add" || 
    !nameSurname && validationType == "update")
      employeeExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";

    const phone1: boolean = this.string(employeeExtDto.phone);
    if (!phone1 && validationType == "add")
      employeeExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const phone2: boolean = this.stringPreciseLength(employeeExtDto.phone, 10);
    if (!phone2 && validationType == "add")
      employeeExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
    
    const employeeTypeId: boolean = this.smallintPositive(employeeExtDto.employeeTypeId);
    if (!employeeTypeId && validationType == "add" || 
    !employeeTypeId && validationType == "update")
      employeeExtDtoErrors.employeeTypeId = "Lütfen personel tipi seçiniz.";
    
    const startDate1: boolean = this.date(employeeExtDto.startDate);
    if (!startDate1 && validationType == "update")
      employeeExtDtoErrors.startDate = "Lütfen işe başlama tarihini seçiniz.";

    const startDate2: boolean = this.dateInPast(employeeExtDto.startDate);
    if (!startDate2 && validationType == "update")
      employeeExtDtoErrors.startDate = "İşe başlama tarihi alanına geçmiş bir tarih girilmelidir.";

    const branchId: boolean = this.bigintPositive(employeeExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      employeeExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(employeeExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      employeeExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(employeeExtDto.accountCode);
    if (!accountCode && validationType == "add")
      employeeExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";

    const identityNumber1: boolean = this.bigintPositive(employeeExtDto.identityNumber);
    if (!identityNumber1 && validationType == "add" || 
    !identityNumber1 && validationType == "update" )
      employeeExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";

    const identityNumber2: boolean = this.numberPreciseLength(employeeExtDto.identityNumber, 11);
    if (!identityNumber2 && validationType == "add" || 
    !identityNumber2 && validationType == "update")
      employeeExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";

    const limit: boolean = this.money(employeeExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      employeeExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";

    for (const key in employeeExtDtoErrors) {
      if (employeeExtDtoErrors[key as keyof EmployeeExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, employeeExtDtoErrors];
  }

  validateFlatExtDto(flatExtDto: FlatExtDto, validationType: string): [boolean, FlatExtDtoErrors] {
    let flatExtDtoErrors = this.flatService.emptyFlatExtDtoErrors;  
    let isValid: boolean = true;

    const sectionId: boolean = this.intPositive(flatExtDto.sectionId);
    if (!sectionId && validationType == "add")
      flatExtDtoErrors.sectionId = "Lütfen site seçiniz.";

    const apartmentId: boolean = this.bigintPositive(flatExtDto.apartmentId);
    if (!apartmentId && validationType == "add")
      flatExtDtoErrors.apartmentId = "Lütfen apartman seçiniz.";

    const doorNumber: boolean = this.intPositive(flatExtDto.doorNumber);
    if (!doorNumber && validationType == "add" || 
    !doorNumber && validationType == "update")
      flatExtDtoErrors.doorNumber = "Lütfen kapı numarası giriniz.";

    for (const key in flatExtDtoErrors) {
      if (flatExtDtoErrors[key as keyof FlatExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, flatExtDtoErrors];
  }

  validateHouseOwnerExtDto(houseOwnerExtDto: HouseOwnerExtDto, validationType: string): [boolean, HouseOwnerExtDtoErrors] {
    let houseOwnerExtDtoErrors = this.houseOwnerService.emptyHouseOwnerExtDtoErrors;  
    let isValid: boolean = true;

    const nameSurname: boolean = this.string(houseOwnerExtDto.nameSurname);
    if (!nameSurname && validationType == "add" || 
    !nameSurname && validationType == "update")
      houseOwnerExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";

    const phone1: boolean = this.string(houseOwnerExtDto.phone);
    if (!phone1 && validationType == "add")
      houseOwnerExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const phone2: boolean = this.stringPreciseLength(houseOwnerExtDto.phone, 10);
    if (!phone2 && validationType == "add")
      houseOwnerExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
    
    const branchId: boolean = this.bigintPositive(houseOwnerExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      houseOwnerExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(houseOwnerExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      houseOwnerExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(houseOwnerExtDto.accountCode);
    if (!accountCode && validationType == "add")
      houseOwnerExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";
    
    const taxOffice: boolean = this.string(houseOwnerExtDto.taxOffice);
    if (!taxOffice && validationType == "add" || 
    !taxOffice && validationType == "update")
      houseOwnerExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";

    const taxNumber: boolean = this.bigintPositive(houseOwnerExtDto.taxNumber);
    if (!taxNumber && validationType == "add" || 
    !taxNumber && validationType == "update")
      houseOwnerExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";

    const identityNumber1: boolean = this.bigintPositive(houseOwnerExtDto.identityNumber);
    if (!identityNumber1 && validationType == "add" || 
    !identityNumber1 && validationType == "update" )
      houseOwnerExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";

    const identityNumber2: boolean = this.numberPreciseLength(houseOwnerExtDto.identityNumber, 11);
    if (!identityNumber2 && validationType == "add" || 
    !identityNumber2 && validationType == "update")
      houseOwnerExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";

    const limit: boolean = this.money(houseOwnerExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      houseOwnerExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
    
    const standartMaturity: boolean = this.smallintPositive(houseOwnerExtDto.standartMaturity);
    if (!standartMaturity && validationType == "add" || 
    !standartMaturity && validationType == "update")
      houseOwnerExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";

    for (const key in houseOwnerExtDtoErrors) {
      if (houseOwnerExtDtoErrors[key as keyof HouseOwnerExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, houseOwnerExtDtoErrors];
  }

  validateSectionExtDto(sectionExtDto: SectionExtDto, validationType: string): [boolean, SectionExtDtoErrors] {
    let sectionExtDtoErrors = this.sectionService.emptySectionExtDtoErrors;  
    let isValid: boolean = true;

    const sectionName: boolean = this.string(sectionExtDto.sectionName);
    if (!sectionName && validationType == "add" || 
    !sectionName && validationType == "update")
      sectionExtDtoErrors.sectionName = "Lütfen site adı giriniz.";

    const sectionGroupId: boolean = this.bigintPositive(sectionExtDto.sectionGroupId);
    if (!sectionGroupId && validationType == "add" || 
    !sectionGroupId && validationType == "update")
      sectionExtDtoErrors.sectionGroupId = "Lütfen site grubu seçiniz.";
      
    const managerId: boolean = this.bigintPositive(sectionExtDto.managerId);
    if (!managerId && validationType == "add" || 
    !managerId && validationType == "update")
      sectionExtDtoErrors.managerId = "Lütfen yönetici seçiniz.";

    const cityId: boolean = this.smallintPositive(sectionExtDto.cityId);
    if (!cityId && validationType == "add" || 
    !cityId && validationType == "update")
      sectionExtDtoErrors.cityId = "Lütfen şehir seçiniz.";

    const districtId: boolean = this.intPositive(sectionExtDto.districtId);
    if (!districtId && validationType == "add" || 
    !districtId && validationType == "update")
      sectionExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";

    const postalCode: boolean = this.intPositive(sectionExtDto.postalCode);
    if (!postalCode && validationType == "add" || 
    !postalCode && validationType == "update")
      sectionExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";

    const addressText: boolean = this.string(sectionExtDto.addressText);
    if (!addressText && validationType == "add" || 
    !addressText && validationType == "update")
      sectionExtDtoErrors.addressText = "Lütfen adres giriniz.";

    for (const key in sectionExtDtoErrors) {
      if (sectionExtDtoErrors[key as keyof SectionExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, sectionExtDtoErrors];
  }

  validateSectionGroupDto(sectionGroupDto: SectionGroupDto, validationType: string): [boolean, SectionGroupDtoErrors] {
    let sectionGroupDtoErrors = this.sectionGroupService.emptySectionGroupDtoErrors;  
    let isValid: boolean = true;

    const sectionGroupName: boolean = this.string(sectionGroupDto.sectionGroupName);
    if (!sectionGroupName && validationType == "add" || 
    !sectionGroupName && validationType == "update")
      sectionGroupDtoErrors.sectionGroupName = "Lütfen site grubu adı giriniz.";

    for (const key in sectionGroupDtoErrors) {
      if (sectionGroupDtoErrors[key as keyof SectionGroupDtoErrors] != "")
        isValid = false;
    }

    return [isValid, sectionGroupDtoErrors];
  }

  validateTenantExtDto(tenantExtDto: TenantExtDto, validationType: string): [boolean, TenantExtDtoErrors] {
    let tenantExtDtoErrors = this.tenantService.emptyTenantExtDtoErrors;  
    let isValid: boolean = true;

    const nameSurname: boolean = this.string(tenantExtDto.nameSurname);
    if (!nameSurname && validationType == "add" || 
    !nameSurname && validationType == "update")
      tenantExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";

    const phone1: boolean = this.string(tenantExtDto.phone);
    if (!phone1 && validationType == "add")
      tenantExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const phone2: boolean = this.stringPreciseLength(tenantExtDto.phone, 10);
    if (!phone2 && validationType == "add")
      tenantExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
    
    const branchId: boolean = this.bigintPositive(tenantExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      tenantExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(tenantExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      tenantExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(tenantExtDto.accountCode);
    if (!accountCode && validationType == "add")
      tenantExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";
    
    const taxOffice: boolean = this.string(tenantExtDto.taxOffice);
    if (!taxOffice && validationType == "add" || 
    !taxOffice && validationType == "update")
      tenantExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";

    const taxNumber: boolean = this.bigintPositive(tenantExtDto.taxNumber);
    if (!taxNumber && validationType == "add" || 
    !taxNumber && validationType == "update")
      tenantExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";

    const identityNumber1: boolean = this.bigintPositive(tenantExtDto.identityNumber);
    if (!identityNumber1 && validationType == "add" || 
    !identityNumber1 && validationType == "update" )
      tenantExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";

    const identityNumber2: boolean = this.numberPreciseLength(tenantExtDto.identityNumber, 11);
    if (!identityNumber2 && validationType == "add" || 
    !identityNumber2 && validationType == "update")
      tenantExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";

    const limit: boolean = this.money(tenantExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      tenantExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
    
    const standartMaturity: boolean = this.smallintPositive(tenantExtDto.standartMaturity);
    if (!standartMaturity && validationType == "add" || 
    !standartMaturity && validationType == "update")
      tenantExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";

    for (const key in tenantExtDtoErrors) {
      if (tenantExtDtoErrors[key as keyof TenantExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, tenantExtDtoErrors];
  }
}
