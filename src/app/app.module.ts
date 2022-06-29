// Angular Modules
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Auth0 Angular JWT Modules
import { JwtModule } from '@auth0/angular-jwt';

// ng-bootstrap Module
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// ng-select Module
import { NgSelectModule } from '@ng-select/ng-select';

// swiper Module
import { SwiperModule } from 'swiper/angular';

// Components
import { AppComponent } from 'src/app/app.component';

// Admin - Admin Dashboard Components
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';

// Customer - Customer Dashboard Components
import { CustomerDashboardComponent } from 'src/app/components/customer/customer-dashboard/customer-dashboard.component';

// Employee - Employee Dashboard Components
import { EmployeeDashboardComponent } from 'src/app/components/employee/employee-dashboard/employee-dashboard.component';

// Layout Components
import { ContentComponent } from 'src/app/components/layout/content/content.component';
import { FooterComponent } from 'src/app/components/layout/footer/footer.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { NavbarComponent } from 'src/app/components/layout/navbar/navbar.component';
import { SidebarFloatingComponent } from 'src/app/components/layout/sidebar-floating/sidebar-floating.component';
import { SidebarStaticComponent } from 'src/app/components/layout/sidebar-static/sidebar-static.component';

// Modal Components
import { ModalComponent } from 'src/app/components/modal/modal.component';

// Admin Components
import { ContactFormComponent } from 'src/app/components/admin/contact-form/contact-form.component';
import { ContactFormDetailComponent } from 'src/app/components/admin/contact-form/contact-form-detail/contact-form-detail.component';
import { ContactFormListComponent } from 'src/app/components/admin/contact-form/contact-form-list/contact-form-list.component';
import { InvoiceComponent } from 'src/app/components/admin/invoice/invoice.component';
import { InvoiceDetailComponent } from 'src/app/components/admin/invoice/invoice-detail/invoice-detail.component';
import { InvoiceListComponent } from 'src/app/components/admin/invoice/invoice-list/invoice-list.component';
import { PersonComponent } from 'src/app/components/admin/person/person.component';
import { PersonDetailComponent } from 'src/app/components/admin/person/person-detail/person-detail.component';
import { PersonListComponent } from 'src/app/components/admin/person/person-list/person-list.component';
import { SuiteComponent } from 'src/app/components/admin/suite/suite.component';
import { SuiteDetailComponent } from 'src/app/components/admin/suite/suite-detail/suite-detail.component';
import { SuiteListComponent } from 'src/app/components/admin/suite/suite-list/suite-list.component';

// Public Components
import { AboutComponent } from 'src/app/components/public/about/about.component';
import { ContactComponent } from 'src/app/components/public/contact/contact.component';
import { ErrorComponent } from 'src/app/components/public/error/error.component';
import { GalleryComponent } from 'src/app/components/public/gallery/gallery.component';
import { HomeComponent } from 'src/app/components/public/home/home.component';
import { LoginComponent } from 'src/app/components/public/login/login.component';
import { NotAuthorizedComponent } from 'src/app/components/public/not-authorized/not-authorized.component';
import { RegisterComponent } from 'src/app/components/public/register/register.component';
import { ReservationComponent } from 'src/app/components/public/reservation/reservation.component';
import { ReservationSuccessComponent } from 'src/app/components/public/reservation//reservation-success/reservation-success.component';
import { ReservationFailComponent } from 'src/app/components/public/reservation/reservation-fail/reservation-fail.component';

// Toast Components
import { ToastComponent } from 'src/app/components/toast/toast.component';

// Interceptors
import { ErrorInterceptor } from 'src/app/interceptors/error.interceptor';

// Pipes
import { SubstringPipe } from 'src/app/pipes/substring.pipe';

// Models
import { PersonExtDto } from 'src/app/models/dtos/person-ext-dto';

// Services
import { CustomDateAdapter } from 'src/app/services/custom-date-adapter.service';
import { CustomDateParserFormatter } from 'src/app/services/custom-date-parser-formatter.service';

@NgModule({
  declarations: [

    AppComponent,

    // Admin - Admin Dashboard Components
    AdminDashboardComponent,

    // Customer - Customer Dashboard Components
    CustomerDashboardComponent,

    // Employee - Employee Dashboard Components
    EmployeeDashboardComponent,

    // Layout Components
    ContentComponent,
    FooterComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarFloatingComponent,
    SidebarStaticComponent,
    
    // Modal Components
    ModalComponent,

    // Admin Components
    ContactFormComponent,
    ContactFormDetailComponent,
    ContactFormListComponent,
    InvoiceComponent,
    InvoiceDetailComponent,
    InvoiceListComponent,
    PersonComponent,
    PersonDetailComponent,
    PersonListComponent,
    SuiteComponent,
    SuiteDetailComponent,
    SuiteListComponent,
    
    // Pipes
    SubstringPipe,

    // Public Components
    AboutComponent,
    ContactComponent,
    ErrorComponent,
    GalleryComponent,
    HomeComponent,
    LoginComponent,
    NotAuthorizedComponent,
    RegisterComponent,
    ReservationComponent,
    ReservationSuccessComponent,
    ReservationFailComponent,

    // Toast Components
    ToastComponent, 
    
  ],
  imports: [
    // Angular Modules
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // Auth0 Angular JWT Modules
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          let personExtDto: PersonExtDto = JSON.parse(localStorage.getItem("personExtDto")!);
          return personExtDto?.accessToken;
        },
        allowedDomains: [
          // Production
          "https://www.kolibryhotelspa.com",
          "https://www.kolibryhotelspa.com",

          // Development
          // "localhost:5001",
          // "localhost:5000",
        ]
      },
    }),

    // ng-bootstrap Module
    NgbModule,

    // ng-select Module
    NgSelectModule,

    // swiper Module
    SwiperModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NgbDateAdapter, useClass: CustomDateAdapter},
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
