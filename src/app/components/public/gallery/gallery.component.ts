import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import SwiperCore, { SwiperOptions, Navigation} from 'swiper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {

  @ViewChild('galleryModal') galleryModal!: ElementRef;

  public config: SwiperOptions = {
    navigation: true,
    slidesPerView: 1,
    spaceBetween: 0,
    initialSlide: 0,
  };

  constructor(
    private modalService: NgbModal,
  ) {
    //console.log("GalleryComponent constructor çalıştı.");
  }

  openImageModal(initialSlide: number): void {
    this.config.initialSlide = initialSlide;
    this.modalService.open(this.galleryModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      fullscreen: true,
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }
}
