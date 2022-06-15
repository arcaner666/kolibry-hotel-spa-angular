// Angular Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Admin - Admin Dashboard Components
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';

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

  // Admin - Dashboard
  {
    path: 'admin/admin-dashboard', component: AdminDashboardComponent, 
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
