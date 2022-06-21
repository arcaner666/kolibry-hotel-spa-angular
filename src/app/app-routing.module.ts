// Angular Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Admin - Admin Dashboard Components
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';

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

// Customer - Customer Dashboard Components
import { CustomerDashboardComponent } from 'src/app/components/customer/customer-dashboard/customer-dashboard.component';

// Employee - Employee Dashboard Components
import { EmployeeDashboardComponent } from 'src/app/components/employee/employee-dashboard/employee-dashboard.component';

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

// Guards
import { AuthorizationGuard } from 'src/app/guards/authorization.guard';

const routes: Routes = [
  // Public
  { path: 'public/about', component: AboutComponent },
  { path: 'public/contact', component: ContactComponent },
  { path: 'public/error', component: ErrorComponent },
  { path: 'public/gallery', component: GalleryComponent },
  { path: 'public/home', component: HomeComponent },
  { path: 'public/login', component: LoginComponent },
  { path: 'public/not-authorized', component: NotAuthorizedComponent },
  { path: 'public/register', component: RegisterComponent },
  { path: 'public/reservation', component: ReservationComponent },
  { path: 'public/reservation-success', component: ReservationSuccessComponent },
  { path: 'public/reservation-fail', component: ReservationFailComponent },

  // Admin
  {
    path: 'admin/admin-dashboard', component: AdminDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/contact-form', component: ContactFormComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/contact-form/contact-form-detail', component: ContactFormDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/contact-form/contact-form-list', component: ContactFormListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/person', component: PersonComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/person/person-detail', component: PersonDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/person/person-list', component: PersonListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/suite', component: SuiteComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/suite/suite-detail', component: SuiteDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/suite/suite-list', component: SuiteListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/invoice', component: InvoiceComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/invoice/invoice-detail', component: InvoiceDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  {
    path: 'admin/invoice/invoice-list', component: InvoiceListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
  },
  
  // Customer - Dashboard
  {
    path: 'customer/customer-dashboard', component: CustomerDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Customer"] },
  },

  // Employee - Dashboard
  {
    path: 'employee/employee-dashboard', component: EmployeeDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Employee"] },
  },

  // Last
  {
    path: '',
    redirectTo: '/public/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/public/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Her route değişiminde gidilen sayfanın en üstüne odaklanır.
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
