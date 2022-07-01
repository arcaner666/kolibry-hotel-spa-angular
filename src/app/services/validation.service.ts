import { Injectable } from '@angular/core';

import { ContactFormDto } from 'src/app/models/dtos/contact-form-dto';
import { ContactFormDtoErrors } from 'src/app/models/validation-errors/contact-form-dto-errors';
import { InvoiceDetailDto } from 'src/app/models/dtos/invoice-detail-dto';
import { InvoiceDetailDtoErrors } from 'src/app/models/validation-errors/invoice-detail-dto-errors';
import { InvoiceExtDto } from 'src/app/models/dtos/invoice-ext-dto';
import { InvoiceExtDtoErrors } from 'src/app/models/validation-errors/invoice-ext-dto-errors';
import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';
import { PersonExtDtoErrors } from 'src/app/models/validation-errors/person-ext-dto-errors';
import { SuiteDto } from 'src/app/models/dtos/suite-dto';
import { SuiteDtoErrors } from 'src/app/models/validation-errors/suite-dto-errors';

import { ContactFormService } from 'src/app/services/contact-form.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { PersonService } from 'src/app/services/person.service';
import { SuiteService } from 'src/app/services/suite.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(
    private contactFormService: ContactFormService,
    private invoiceService: InvoiceService,
    private personService: PersonService,
    private suiteService: SuiteService,
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

  dateDifferencePositive(value1: Date | undefined | null, value2: Date | undefined | null,): boolean {
    return (
      value1 == undefined || value1 == null ||
      value2 == undefined || value2 == null || new Date(value2).valueOf() <= new Date(value1).valueOf() ? false : true);
  }

  int(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value < -2147483648 || value > 2147483647 ? false : true);
  }

  intPositive(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value <= 0 || value > 2147483647 ? false : true);
  }

  compareString(value1: string | undefined | null, value2: string | undefined | null): boolean {
    return (
      value1 == undefined || value1 == null || 
      value2 == undefined || value2 == null || value1 !== value2 ? false : true);
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
    return (value == undefined || value == null || value <= minValue || value >= maxValue ? false : true);
  }

  rangeInclude(value: number | undefined | null, minValue: number, maxValue: number): boolean {
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

  stringMinLength(value: string | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.length < length ? false : true);
  }
  
  stringPreciseLength(value: string | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.length != length ? false : true);
  }

  tinyint(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value <= 0 || value > 255 ? false : true);
  }

  tinyintWithZero(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value < 0 || value > 255 ? false : true);
  }

  // Kurallar
  validateContactFormDtoForAdd(contactFormDto: ContactFormDto): [boolean, ContactFormDtoErrors] {
    let contactFormDtoErrors = this.contactFormService.emptyContactFormDtoErrors;  
    let isValid: boolean = true;

    const nameSurname: boolean = this.string(contactFormDto.nameSurname);
    if (!nameSurname)
      contactFormDtoErrors.nameSurname = "Lütfen adınızı ve soyadınızı giriniz.";

    const email: boolean = this.string(contactFormDto.email);
    if (!email)
      contactFormDtoErrors.email = "Lütfen e-posta adresinizi giriniz.";
      
    const phone: boolean = this.string(contactFormDto.phone);
    if (!phone)
      contactFormDtoErrors.phone = "Lütfen telefon numaranızı giriniz.";

    const message: boolean = this.string(contactFormDto.message);
    if (!message)
      contactFormDtoErrors.message = "Lütfen iletmek istediğiniz mesajınızı yazınız.";
      
    for (const key in contactFormDtoErrors) {
      if (contactFormDtoErrors[key as keyof ContactFormDtoErrors] != "")
        isValid = false;
    }

    return [isValid, contactFormDtoErrors];
  }

  validateInvoiceDetailDtoForAdd(invoiceDetailDto: InvoiceDetailDto): [boolean, InvoiceDetailDtoErrors] {
    let invoiceDetailDtoErrors = this.invoiceService.emptyInvoiceDetailDtoErrors;  
    let isValid: boolean = true;

    const suiteId: boolean = this.intPositive(invoiceDetailDto.suiteId);
    if (!suiteId)
      invoiceDetailDtoErrors.suiteId = "Lütfen odanızı seçiniz.";

    const amount: boolean = this.tinyint(invoiceDetailDto.amount);
    if (!amount)
      invoiceDetailDtoErrors.amount = "Rezervasyon oluşturabilmek için en az bir gün konaklamanız gerekmektedir.";
      
    for (const key in invoiceDetailDtoErrors) {
      if (invoiceDetailDtoErrors[key as keyof InvoiceDetailDtoErrors] != "")
        isValid = false;
    }

    return [isValid, invoiceDetailDtoErrors];
  }
  
  validateInvoiceExtDtoForAdd(invoiceExtDto: InvoiceExtDto): [boolean, InvoiceExtDtoErrors] {
    let invoiceExtDtoErrors = this.invoiceService.emptyInvoiceExtDtoErrors;  
    let isValid: boolean = true;

    const currencyId: boolean = this.tinyint(invoiceExtDto.currencyId);
    if (!currencyId)
      invoiceExtDtoErrors.currencyId = "Lütfen döviz tipini seçiniz.";

    const buyerNameSurname: boolean = this.string(invoiceExtDto.buyerNameSurname);
    if (!buyerNameSurname)
      invoiceExtDtoErrors.buyerNameSurname = "Lütfen adınızı ve soyadınızı giriniz.";
    
    const buyerEmail: boolean = this.string(invoiceExtDto.buyerEmail);
    if (!buyerEmail)
      invoiceExtDtoErrors.buyerEmail = "Lütfen e-posta adresinizi giriniz.";
    
    const buyerPhone: boolean = this.string(invoiceExtDto.buyerPhone);
    if (!buyerPhone)
      invoiceExtDtoErrors.buyerPhone = "Lütfen telefon numarası giriniz.";
      
    const buyerAddress: boolean = this.string(invoiceExtDto.buyerAddress);
    if (!buyerAddress)
      invoiceExtDtoErrors.buyerAddress = "Lütfen adresinizi giriniz.";

    const reservationStartDate: boolean = this.date(invoiceExtDto.reservationStartDate);
    if (!reservationStartDate)
      invoiceExtDtoErrors.reservationStartDate = "Lütfen otele giriş yapacağınız tarihi seçiniz.";
      
    const reservationEndDate1: boolean = this.dateDifferencePositive(invoiceExtDto.reservationStartDate, invoiceExtDto.reservationEndDate);
    if (!reservationEndDate1)
      invoiceExtDtoErrors.reservationEndDate = "Otelden çıkış tarihi giriş tarihinden önce olamaz.";
    
    const reservationEndDate2: boolean = this.date(invoiceExtDto.reservationEndDate);
    if (!reservationEndDate2)
      invoiceExtDtoErrors.reservationEndDate = "Lütfen otele çıkış yapacağınız tarihi seçiniz.";
      
    const adult: boolean = this.rangeInclude(invoiceExtDto.adult, 1, 12);
    if (!adult)
      invoiceExtDtoErrors.adult = "Lütfen yetişkin sayısını seçiniz.";

    const child: boolean = this.rangeInclude(invoiceExtDto.child, 0, 6);
    if (!child)
      invoiceExtDtoErrors.child = "Lütfen çocuk sayısını seçiniz.";
    
    if (invoiceExtDto.child >= 1) {
      const childAge1: boolean = this.rangeInclude(invoiceExtDto.childAge1, 1, 12);
      if (!childAge1)
        invoiceExtDtoErrors.childAge1 = "Lütfen birinci çocuğun yaşını seçiniz.";
    }

    if (invoiceExtDto.child >= 2) {
      const childAge2: boolean = this.rangeInclude(invoiceExtDto.childAge2, 1, 12);
      if (!childAge2)
        invoiceExtDtoErrors.childAge2 = "Lütfen ikinci çocuğun yaşını seçiniz.";
    }
    
    if (invoiceExtDto.child >= 3) {
      const childAge3: boolean = this.rangeInclude(invoiceExtDto.childAge3, 1, 12);
      if (!childAge3)
        invoiceExtDtoErrors.childAge3 = "Lütfen üçüncü çocuğun yaşını seçiniz.";
    }
        
    if (invoiceExtDto.child >= 4) {
      const childAge4: boolean = this.rangeInclude(invoiceExtDto.childAge4, 1, 12);
      if (!childAge4)
        invoiceExtDtoErrors.childAge4 = "Lütfen dördüncü çocuğun yaşını seçiniz.";
    }
        
    if (invoiceExtDto.child >= 5) {
      const childAge5: boolean = this.rangeInclude(invoiceExtDto.childAge5, 1, 12);
      if (!childAge5)
        invoiceExtDtoErrors.childAge5 = "Lütfen beşinci çocuğun yaşını seçiniz.";
    }
        
    if (invoiceExtDto.child >= 6) {
      const childAge6: boolean = this.rangeInclude(invoiceExtDto.childAge6, 1, 12);
      if (!childAge6)
        invoiceExtDtoErrors.childAge6 = "Lütfen altıncı çocuğun yaşını seçiniz.";
    }

    for (const key in invoiceExtDtoErrors) {
      if (invoiceExtDtoErrors[key as keyof InvoiceExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, invoiceExtDtoErrors];
  }

  validatePersonExtDtoForLoginWithEmail(personExtDto: PersonExtDto): [boolean, PersonExtDtoErrors] {
    let personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;  
    let isValid: boolean = true;

    const email: boolean = this.string(personExtDto.email);
    if (!email)
      personExtDtoErrors.email = "Lütfen e-posta adresi giriniz.";

    const password: boolean = this.string(personExtDto.password);
    if (!password)
      personExtDtoErrors.password = "Lütfen şifre giriniz.";

    for (const key in personExtDtoErrors) {
      if (personExtDtoErrors[key as keyof PersonExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, personExtDtoErrors];
  }

  validatePersonExtDtoForLoginWithPhone(personExtDto: PersonExtDto): [boolean, PersonExtDtoErrors] {
    let personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;  
    let isValid: boolean = true;

    const phone: boolean = this.string(personExtDto.phone);
    if (!phone)
      personExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const password: boolean = this.string(personExtDto.password);
    if (!password)
      personExtDtoErrors.password = "Lütfen şifre giriniz.";

    for (const key in personExtDtoErrors) {
      if (personExtDtoErrors[key as keyof PersonExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, personExtDtoErrors];
  }

  validatePersonExtDtoForAdd(personExtDto: PersonExtDto): [boolean, PersonExtDtoErrors] {
    let personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;  
    let isValid: boolean = true;

    const email: boolean = this.string(personExtDto.email);
    if (!email)
      personExtDtoErrors.email = "Lütfen e-posta adresi giriniz.";
      
    const phone: boolean = this.string(personExtDto.phone);
    if (!phone)
      personExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const password1: boolean = this.stringMinLength(personExtDto.password, 6);
    if (!password1)
      personExtDtoErrors.password = "Şifre en az 6 karakterden oluşmalıdır.";
      
    const password2: boolean = this.string(personExtDto.password);
    if (!password2)
      personExtDtoErrors.password = "Lütfen şifre giriniz.";

    const passwordAgain: boolean = this.compareString(personExtDto.password, personExtDto.passwordAgain);
    if (!passwordAgain)
      personExtDtoErrors.passwordAgain = "Şifreler eşleşmiyor.";

    for (const key in personExtDtoErrors) {
      if (personExtDtoErrors[key as keyof PersonExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, personExtDtoErrors];
  }

  validatePersonExtDtoForUpdate(personExtDto: PersonExtDto): [boolean, PersonExtDtoErrors] {
    let personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;  
    let isValid: boolean = true;

    const oldPassword: boolean = this.string(personExtDto.oldPassword);
    if (!oldPassword)
      personExtDtoErrors.oldPassword = "Lütfen eski şifrenizi giriniz.";

    const password1: boolean = this.stringMinLength(personExtDto.password, 6);
    if (!password1)
      personExtDtoErrors.password = "Şifre en az 6 karakterden oluşmalıdır.";
      
    const password2: boolean = this.string(personExtDto.password);
    if (!password2)
      personExtDtoErrors.password = "Lütfen yeni şifrenizi giriniz.";

    const passwordAgain: boolean = this.compareString(personExtDto.password, personExtDto.passwordAgain);
    if (!passwordAgain)
      personExtDtoErrors.passwordAgain = "Şifreler eşleşmiyor.";

    for (const key in personExtDtoErrors) {
      if (personExtDtoErrors[key as keyof PersonExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, personExtDtoErrors];
  }

  validateSuiteDtoForAdd(suiteDto: SuiteDto): [boolean, SuiteDtoErrors] {
    let suiteDtoErrors = this.suiteService.emptySuiteDtoErrors;  
    let isValid: boolean = true;

    const title: boolean = this.string(suiteDto.title);
    if (!title)
      suiteDtoErrors.title = "Lütfen oda adı giriniz.";
    
    const bed: boolean = this.tinyint(suiteDto.bed);
    if (!bed)
      suiteDtoErrors.bed = "Lütfen odadaki yatak sayısını giriniz.";
      
    const m2: boolean = this.smallintPositive(suiteDto.m2);
    if (!m2)
      suiteDtoErrors.m2 = "Lütfen odanın alanını metrekare cinsinden giriniz.";

    const price: boolean = this.smallmoney(suiteDto.price);
    if (!price)
      suiteDtoErrors.price = "Lütfen günlük oda fiyatını giriniz.";
      
    const vat: boolean = this.smallmoney(suiteDto.vat);
    if (!vat)
      suiteDtoErrors.vat = "Lütfen KDV oranını giriniz.";

    for (const key in suiteDtoErrors) {
      if (suiteDtoErrors[key as keyof SuiteDtoErrors] != "")
        isValid = false;
    }

    return [isValid, suiteDtoErrors];
  }
}
