import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PersonService } from 'src/app/services/person.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private personService: PersonService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Bu yapı API'ye yaptığımız isteklerin sonucunda dönen hataları yakalayarak 
      // arayüze geri döndürüyor.
      catchError(error => {
        //console.log(error);
        if (error.error?.message == "TokenInvalid" || error.error?.message == "CanNotGetPrincipal") {
          this.personService.clearPersonExtDto();
          this.router.navigate(['public/not-authorized', 'public/login']);
        }
        // catchError backend'den dönen hatayı ekstra bir hata katmanıyla sarmalıyor.
        // Backend'den dönen yanıta erişmek için error.error dememiz gerekiyor.
        return throwError(() => error.error);
      })
    );
  }
}
