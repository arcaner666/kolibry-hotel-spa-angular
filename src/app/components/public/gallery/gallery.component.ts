import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {

  @ViewChild('galleryModal') galleryModal!: ElementRef;

  constructor(
    private modalService: NgbModal,
  ) {
    console.log("GalleryComponent constructor çalıştı.");
  }

  openImageModal(): void {
    this.modalService.open(this.galleryModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }
}
