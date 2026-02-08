import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { FleetComponent } from './pages/fleet/fleet.component';
import { ChauffeurComponent } from './pages/chauffeurs/chauffeurs.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PartnershipsComponent } from './pages/partnerships/partnerships.component';
import { EventsComponent } from './pages/events/events.component';
import { TourismComponent } from './pages/tourism/tourism.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { BookingComponent } from './pages/booking/booking.component';
import { BookingStatusComponent } from './pages/booking-status/booking-status.component';
import { BookingErrorComponent } from './pages/booking-error/booking-error.component';
import { bookingTokenGuard } from './guards/booking-token.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'fleet', component: FleetComponent },
      { path: 'chauffeurs', component: ChauffeurComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'partnerships', component: PartnershipsComponent },
      { path: 'events', component: EventsComponent, canActivate: [bookingTokenGuard] },
      { path: 'tourism', component: TourismComponent, canActivate: [bookingTokenGuard] },
      { path: 'transfer', component: TransferComponent, canActivate: [bookingTokenGuard] },
      { path: 'booking', component: BookingComponent },
      { path: 'booking/:serviceType', component: BookingComponent },
      { path: 'booking-status/:bookingId', component: BookingStatusComponent },
      { path: 'booking-error', component: BookingErrorComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
