import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-reservation-fail',
  templateUrl: './reservation-fail.component.html',
  styleUrls: ['./reservation-fail.component.scss']
})
export class ReservationFailComponent implements OnInit, OnDestroy {

  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
  ) { 
    //console.log("ReservationFailComponent constructor çalıştı.");
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
