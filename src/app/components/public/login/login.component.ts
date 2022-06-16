import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil} from 'rxjs';

import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';
import { PersonExtDtoErrors } from 'src/app/models/validation-errors/person-ext-dto-errors';
import { Result } from 'src/app/models/results/result';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PersonService } from 'src/app/services/person.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  public loadingPhone: boolean = false;
  public loadingEmail: boolean = false;
  public passwordTextType: boolean = false;
  public personExtDto: PersonExtDto;
  public personExtDtoErrors: PersonExtDtoErrors;
  public refreshTokenDurationOptions = [
    { duration: 3600, text: '1 saat boyunca' }, 
    { duration: 86400, text: '1 gün boyunca' }, 
    { duration: 604800, text: '1 hafta boyunca' }, 
    { duration: 18144000, text: '1 ay boyunca' }, 
    { duration: 999999999, text: 'Süresiz' }
  ];
  public result: Result = {
    success: false, 
    message: "",
  };
  public submittedPhone: boolean = false;
  public submittedEmail: boolean = false;

  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private navigationService: NavigationService,
    private personService: PersonService,
    private toastService: ToastService,
    private validationService: ValidationService,

    public breakpointService: BreakpointService
  ) {
    console.log("LoginComponent constructor çalıştı.");

    this.personExtDto = this.personService.emptyPersonExtDto;
    this.personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;
    this.personExtDto.refreshTokenDuration = 3600;

    // Oturum açılma durumuna göre kullanıcıları yönlendir.
    this.navigationService.navigateByRole(this.personService.personExtDto?.role);

    // Sidebar linklerini düzenle.
    this.navigationService.loadSidebarLinksByRole();
  }

  // Şifre göstermeyi tetikler.
  togglePasswordTextType(): void {
    this.passwordTextType = !this.passwordTextType;
  }

  loginWithEmail(): void {
    this.submittedEmail = true;
    let [isModelValid, errors] = this.validationService.validatePersonExtDtoForLoginWithEmail(this.personExtDto);
    this.personExtDtoErrors = errors;
    if (isModelValid) {
      this.loadingEmail  = true;

      this.personService.loginWithEmail(this.personExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        // Eğer giriş başarılıysa
        next: (response) => {      
          // Kullanıcı bilgilerini sakla.
          this.personService.personExtDto = response.data;

          // Oturum açılma durumuna göre kullanıcıları yönlendir.
          this.navigationService.navigateByRole(this.personService.personExtDto?.role);

          // Sidebar linklerini düzenle.
          this.navigationService.loadSidebarLinksByRole();

          this.loadingEmail = false;
        },
        error: (error) => {
          console.log(error);
          // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
          this.result.success = error.success;
          this.result.message = error.message;
          this.loadingEmail = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.personExtDtoErrors);
    }
  }

  loginWithPhone(): void {
    this.submittedPhone = true;
    let [isModelValid, errors] = this.validationService.validatePersonExtDtoForLoginWithPhone(this.personExtDto);
    this.personExtDtoErrors = errors;
    if (isModelValid) {
      this.loadingPhone  = true;

      this.personService.loginWithPhone(this.personExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        // Eğer giriş başarılıysa
        next: (response) => {      
          // Kullanıcı bilgilerini sakla.
          this.personService.personExtDto = response.data;

          // Oturum açılma durumuna göre kullanıcıları yönlendir.
          this.navigationService.navigateByRole(this.personService.personExtDto.role);

          // Sidebar linklerini düzenle.
          this.navigationService.loadSidebarLinksByRole();

          this.loadingPhone = false;
        },
        error: (error) => {
          console.log(error);
          // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
          this.result.success = error.success;
          this.result.message = error.message;
          this.loadingPhone = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.personExtDtoErrors);
    }
  }

  // Giriş tipleri arasında geçiş yapıldığında formları varsayılan hallerine getirir.
  resetForms(): void  {
    this.result = {
      success: false, 
      message: "",
    };

    this.personExtDto = this.personService.emptyPersonExtDto;
    this.personExtDtoErrors = this.personService.emptyPersonExtDtoErrors;
    this.personExtDto.refreshTokenDuration = 3600;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
