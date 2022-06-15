import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LayoutConfig } from 'src/app/models/various/layout-config';
import { NavGroup } from 'src/app/models/various/nav-group';
import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public activeLinkId: number = 0;
  public isSidebarCollapsed: boolean = true;
  public layoutConfig$: Observable<LayoutConfig>;
  public personExtDto$: Observable<PersonExtDto>;
  public sidebarLinks$: Observable<NavGroup[]>;
  
  constructor(
    private navigationService: NavigationService,
    private layoutService: LayoutService,
    private personService: PersonService,

    public breakpointService: BreakpointService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.navigationService.loadSidebarLinksByRole();
    
    this.layoutConfig$ = this.layoutService.layoutConfigObservable;
    this.personExtDto$ = this.personService.personExtDto$;
    this.sidebarLinks$ = this.navigationService.sidebarLinks$;
  }

  toggleSidebarFloating(): void {
    this.layoutService.toggleSidebarFloating();
  }

  logout(): void {
    this.personService.logout().subscribe();
    this.personService.clearPersonExtDto();
    this.navigationService.loadSidebarLinksByRole();
    this.router.navigate(["public/home"]);
    if (this.breakpointService.screenSize.width < 576) {
      this.layoutService.toggleSidebarFloating();
    }
  }

  ngOnInit(): void {

  }
}
