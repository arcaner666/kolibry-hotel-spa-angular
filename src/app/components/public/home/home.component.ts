import { Component, OnInit } from '@angular/core';

import SwiperCore, { SwiperOptions, Autoplay, EffectFade, Navigation, Pagination, Scrollbar, Zoom } from 'swiper';

SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  config: SwiperOptions = {
    autoplay: {
      delay: 2500,
      disableOnInteraction: false
    },
    effect:'fade',
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

  onSwiper([swiper]: any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
