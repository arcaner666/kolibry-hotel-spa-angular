import { Component, OnInit } from '@angular/core';

import SwiperCore, { SwiperOptions, Autoplay, EffectFade, Navigation, Pagination } from 'swiper';

SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  config: SwiperOptions = {
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

  constructor() {
    console.log("HomeComponent constructor çalıştı.");
  }

  ngOnInit(): void {
  }
}
