import { Component, HostListener, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { LayoutConfig } from 'src/app/models/various/layout-config';
import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  public layoutConfig$: Observable<LayoutConfig>;
  public personExtDto$: Observable<PersonExtDto>;

  constructor(
    private personService: PersonService,

    public layoutService: LayoutService,
    public breakpointService: BreakpointService,
  ) {
    this.layoutConfig$ = this.layoutService.layoutConfigObservable;
    this.personExtDto$ = this.personService.personExtDto$;
    
    this.setScreenSize();
    this.selectLayout();
    
    // Oturum durumu değiştiğinde selectLayout() metodunun tekrar tetiklenmesi gerekiyor.
    this.subscribePersonExtDtoChanges();
  }

  setScreenSize(): void {
    this.breakpointService.screenSize.width = window.innerWidth;
    this.breakpointService.screenSize.height = window.innerHeight;
  }

  selectLayout(): void {
    if (this.breakpointService.screenSize.width >= 992 && this.personService.personExtDto?.role) {
      this.layoutService.layoutConfig.layoutType = "sidebar-static";
    } else if (this.breakpointService.screenSize.width < 992) {
      this.layoutService.layoutConfig.layoutType = "sidebar-floating";
    } else if (this.breakpointService.screenSize.width >= 992 && !this.personService.personExtDto?.role) {
      this.layoutService.layoutConfig.layoutType = "only-content";
    } else {
      this.layoutService.layoutConfig.layoutType = "only-content";
    }
  }
  subscribePersonExtDtoChanges(): void {
    this.personService.personExtDto$.subscribe({
      next: () => {
        this.selectLayout();
      }
    });
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setScreenSize();
    this.selectLayout();
  }
}
