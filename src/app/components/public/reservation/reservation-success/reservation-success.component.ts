import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-reservation-success',
  templateUrl: './reservation-success.component.html',
  styleUrls: ['./reservation-success.component.scss']
})
export class ReservationSuccessComponent implements OnInit, OnDestroy {

  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
  ) { 
    //console.log("ReservationSuccessComponent constructor çalıştı.");
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
