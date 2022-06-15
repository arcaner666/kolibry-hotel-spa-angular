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

// Toast Components
import { ToastComponent } from 'src/app/components/toast/toast.component';

// Interceptors
import { ErrorInterceptor } from 'src/app/interceptors/error.interceptor';

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
          "localhost:5001",
          "localhost:5000",
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
