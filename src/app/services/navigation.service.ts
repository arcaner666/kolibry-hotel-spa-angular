import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { NavGroup } from 'src/app/models/various/nav-group';
import { RouteHistory } from 'src/app/models/various/route-history';

import { PersonService } from 'src/app/services/person.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _emptyRouteHistory: RouteHistory = {
    previousRoute: "",
    accountId: 0,
  };
  private routeHistorySubject: BehaviorSubject<RouteHistory>;
  private sidebarLinksSubject: BehaviorSubject<NavGroup[]>;

  public adminSidebarLinks: NavGroup[] = [
    {
      id: "admin-dashboard",
      title: "Özet",
      url: "admin/admin-dashboard",
      type: "item",
      role: ["Admin"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "persons",
      title: "Kişiler",
      url: "admin/person",
      type: "item",
      role: ["Admin"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "suites",
      title: "Odalar",
      url: "admin/suite",
      type: "item",
      role: ["Admin"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "invoices",
      title: "Satışlar",
      url: "admin/invoice",
      type: "item",
      role: ["Admin"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "reservations",
      title: "Rezervasyonlar",
      url: "admin/reservation",
      type: "item",
      role: ["Admin"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "contacts",
      title: "İletişim Formları",
      url: "admin/contact",
      type: "item",
      role: ["Admin"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
  ];
  public customerSidebarLinks: NavGroup[] = [
    {
      id: "customer-dashboard",
      title: "Özet",
      url: "customer/customer-dashboard",
      type: "item",
      role: ["Customer"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
  ];
  public publicSidebarLinks: NavGroup[] = [
    {
      id: "home",
      title: "Anasayfa",
      url: "/public/home",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "gallery",
      title: "Galeri",
      url: "/public/gallery",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "contact",
      title: "İletişim",
      url: "/public/contact",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "reservation",
      title: "Rezervasyon",
      url: "/public/reservation",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
  ];
  public routeHistory$: Observable<RouteHistory>;
  public employeeSidebarLinks: NavGroup[] = [
    {
      id: "employee-dashboard",
      title: "Özet",
      url: "employee/employee-dashboard",
      type: "item",
      role: ["Employee"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
  ];
  public sidebarLinks$: Observable<NavGroup[]>;

  constructor(
    private personService: PersonService,
    private router: Router
  ) {
    this.sidebarLinksSubject = new BehaviorSubject<NavGroup[]>(this.publicSidebarLinks);
    this.sidebarLinks$ = this.sidebarLinksSubject.asObservable();

    this.routeHistorySubject = new BehaviorSubject<RouteHistory>(cloneDeep(this._emptyRouteHistory));
    this.routeHistory$ = this.routeHistorySubject.asObservable();
  }

  get emptyRouteHistory(): RouteHistory {
    return cloneDeep(this._emptyRouteHistory);
  }

  get routeHistory(): RouteHistory {
    return this.routeHistorySubject.value;
  }

  set routeHistory(routeHistory: RouteHistory){
    this.routeHistorySubject.next(routeHistory);
  }

  get sidebarLinks(): NavGroup[] {
    return this.sidebarLinksSubject.value;
  }

  set sidebarLinks(sidebarLinks: NavGroup[]){
    this.sidebarLinksSubject.next(sidebarLinks);
  }

  loadSidebarLinksByRole(): void {
    if(this.personService.personExtDto?.role == "Admin"){
      this.sidebarLinks = this.adminSidebarLinks;
    } else if (this.personService.personExtDto?.role == "Employee") {
      this.sidebarLinks = this.employeeSidebarLinks;
    } else if (this.personService.personExtDto?.role == "Customer") {
      this.sidebarLinks = this.customerSidebarLinks;
    } else {
      this.sidebarLinks = this.publicSidebarLinks;
    }
  }

  // Role göre kullanıcıyı yönlendir.
  navigateByRole(role: string): void {
    if(role) {
      switch (role) {
        case "Admin": this.router.navigate(['admin/admin-dashboard']); break;
        case "Employee": this.router.navigate(['employee/employee-dashboard']); break;
        case "Customer": this.router.navigate(['customer/customer-dashboard']); break;
        default: this.router.navigate(['/']); break;
      }
    } 
  }
}
