import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import SwiperCore, { SwiperOptions, Autoplay, EffectFade, Navigation, Pagination } from 'swiper';

import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';

import { NavigationService } from 'src/app/services/navigation.service';
import { PersonService } from 'src/app/services/person.service';

SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  public config: SwiperOptions = {
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    effect: 'fade',
    navigation: true,
    pagination: { clickable: true },
    slidesPerView: 1,
    spaceBetween: 0,
  };

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private navigationService: NavigationService,
    private personService: PersonService
  ) {
    //console.log("HomeComponent constructor çalıştı.");

    this.navigationService.navigateByRole(this.personService.personExtDto?.role);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
