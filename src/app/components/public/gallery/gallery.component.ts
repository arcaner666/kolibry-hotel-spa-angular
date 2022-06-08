import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  constructor() {
    console.log("GalleryComponent constructor çalıştı.");
  }

  ngOnInit(): void {
  }

}
