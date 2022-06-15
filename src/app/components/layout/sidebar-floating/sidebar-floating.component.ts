import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { LayoutConfig } from 'src/app/models/various/layout-config';
import { NavGroup } from 'src/app/models/various/nav-group';
import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-sidebar-floating',
  templateUrl: './sidebar-floating.component.html',
  styleUrls: ['./sidebar-floating.component.scss']
})
export class SidebarFloatingComponent implements OnInit {

  public layoutConfig$: Observable<LayoutConfig>;
  public personExtDto$: Observable<PersonExtDto>;
  public sidebarLinks$: Observable<NavGroup[]>;

  constructor(
    private layoutService: LayoutService,
    private navigationService: NavigationService,
    private personService: PersonService,
    private router: Router,

    public breakpointService: BreakpointService
  ) {
    this.navigationService.loadSidebarLinksByRole();

    this.personExtDto$ = this.personService.personExtDto$;
    this.layoutConfig$ = this.layoutService.layoutConfigObservable;
    this.sidebarLinks$ = this.navigationService.sidebarLinks$;
  }

  logout(): void {
    this.personService.clearPersonExtDto();
    this.navigationService.loadSidebarLinksByRole();
    this.router.navigate(["public/home"]);
    this.toggleSidebarFloating();
  }

  toggleSidebarFloating(): void {
    this.layoutService.toggleSidebarFloating();
  }

  ngOnInit(): void {
  }

}
