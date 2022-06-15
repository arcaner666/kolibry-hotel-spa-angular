import { Injectable } from '@angular/core';

import { ContactDto } from 'src/app/models/dtos/contact-dto';
import { ContactDtoErrors } from 'src/app/models/validation-errors/contact-dto-errors';
import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';
import { PersonExtDtoErrors } from 'src/app/models/validation-errors/person-ext-dto-errors';

import { ContactService } from 'src/app/services/contact.service';
import { PersonService } from 'src/app/services/person.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(

    private contactService: ContactService,
    private personService: PersonService,
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

  // Kurallar
  validateContactDto(contactDto: ContactDto, validationType: string): [boolean, ContactDtoErrors] {
    let contactDtoErrors = this.contactService.emptyContactDtoErrors;  
    let isValid: boolean = true;

    const branchId: boolean = this.string(contactDto.nameSurname);
    if (!branchId && validationType == "add")
      contactDtoErrors.nameSurname = "Lütfen adınızı ve soyadınızı giriniz.";

    const accountName: boolean = this.string(contactDto.email);
    if (!accountName && validationType == "add")
      contactDtoErrors.email = "Lütfen e-posta adresinizi giriniz.";

    const accountCode: boolean = this.string(contactDto.phone);
    if (!accountCode && validationType == "add")
      contactDtoErrors.phone = "Lütfen telefon numaranızı giriniz.";

    const limit: boolean = this.string(contactDto.message);
    if (!limit && validationType == "add")
      contactDtoErrors.message = "Lütfen iletmek istediğiniz mesajınızı yazınız.";
      
    for (const key in contactDtoErrors) {
      if (contactDtoErrors[key as keyof ContactDtoErrors] != "")
        isValid = false;
    }

    return [isValid, contactDtoErrors];
  }

  validatePersonExtDtoForLoginWithEmail(personExtDto: PersonExtDto, validationType: string): [boolean, PersonExtDtoErrors] {
    let personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;  
    let isValid: boolean = true;

    const email: boolean = this.string(personExtDto.email);
    if (!email && validationType == "add")
      personExtDtoErrors.email = "Lütfen e-posta adresi giriniz.";

    const password: boolean = this.string(personExtDto.password);
    if (!password && validationType == "add")
      personExtDtoErrors.password = "Lütfen şifre giriniz.";

    for (const key in personExtDtoErrors) {
      if (personExtDtoErrors[key as keyof PersonExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, personExtDtoErrors];
  }

  validatePersonExtDtoForLoginWithPhone(personExtDto: PersonExtDto, validationType: string): [boolean, PersonExtDtoErrors] {
    let personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;  
    let isValid: boolean = true;

    const phone: boolean = this.string(personExtDto.phone);
    if (!phone && validationType == "add")
      personExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const password: boolean = this.string(personExtDto.password);
    if (!password && validationType == "add")
      personExtDtoErrors.password = "Lütfen şifre giriniz.";

    for (const key in personExtDtoErrors) {
      if (personExtDtoErrors[key as keyof PersonExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, personExtDtoErrors];
  }

  validatePersonExtDtoForRegister(personExtDto: PersonExtDto, validationType: string): [boolean, PersonExtDtoErrors] {
    let personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;  
    let isValid: boolean = true;

    const email: boolean = this.string(personExtDto.email);
    if (!email && validationType == "add")
      personExtDtoErrors.email = "Lütfen e-posta adresi giriniz.";
    
    const phone1: boolean = this.stringPreciseLength(personExtDto.phone, 10);
    if (!phone1 && validationType == "add")
      personExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
      
    const phone2: boolean = this.string(personExtDto.phone);
    if (!phone2 && validationType == "add")
      personExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const password1: boolean = this.stringMinLength(personExtDto.password, 6);
    if (!password1 && validationType == "add")
      personExtDtoErrors.password = "Şifre en az 6 karakterden oluşmalıdır.";
      
    const password2: boolean = this.string(personExtDto.password);
    if (!password2 && validationType == "add")
      personExtDtoErrors.password = "Lütfen şifre giriniz.";

    const passwordAgain: boolean = this.compareString(personExtDto.password, personExtDto.passwordAgain);
    if (!passwordAgain && validationType == "add")
      personExtDtoErrors.passwordAgain = "Şifreler eşleşmiyor.";

    for (const key in personExtDtoErrors) {
      if (personExtDtoErrors[key as keyof PersonExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, personExtDtoErrors];
  }

}
