import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { Observable, concatMap, of } from 'rxjs';

import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';

import { JwtHelperService } from '@auth0/angular-jwt';
import { PersonService } from 'src/app/services/person.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationGuard implements CanActivate {

  private personExtDto: PersonExtDto;
  
  constructor(
    private jwtHelperService: JwtHelperService,
    private personService: PersonService,
    private router: Router,
  ) { 
    this.personExtDto = this.personService.personExtDto;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log("AuthorizationGuard çalıştı.");
    return this.personService.personExtDto$
    .pipe(
      concatMap((personExtDto) => {
        if (!personExtDto) {
          console.log("Oturum açılmamış!");
          this.router.navigate(["public/login"]);
          return of(false);
        }

        if (!route.data['roles'] || route.data['roles'].indexOf(personExtDto.role) == -1) {
          console.log("Gerekli yetkiler yok!");
          this.router.navigate(['public/not-authorized']);
          return of(false);
        }

        if (this.jwtHelperService.isTokenExpired(personExtDto.accessToken)) {
          console.log("AccessToken'ın süresi bitmiş, yenilemeye çalışılıyor...");
          return this.personService.refreshAccessToken(personExtDto)
          .pipe(
            concatMap((response) => {
              console.log("AccessToken yenilendi.");
              this.personExtDto.accessToken = response.data.accessToken;
              this.personService.personExtDto = this.personExtDto;
              return of(true);
            }),
            catchError((error) => {
              console.log(error);
              console.log("AccessToken yenilenemedi!");
              this.personService.clearPersonExtDto();
              this.router.navigate(["public/login"]);
              return of(false);
            })
          )
        }

        return of(true);
      })
    );
  }
}
