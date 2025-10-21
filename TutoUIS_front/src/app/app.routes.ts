import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { CalendarComponent } from './pages/calendar/calendar';
import { AuthGuard } from './guards/auth.guard';
import { DashboardLayout } from './pages/dashboard/layout/dashboard-layout';
import { DashboardHome } from './pages/dashboard/home/dashboard-home';
import { ReservationForm } from './pages/dashboard/reservation/reservation-form';
import { Agenda } from './pages/dashboard/agenda/agenda';
import { Reservations, History, Profile, Settings } from './pages/dashboard/sections/placeholder';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'calendar', component: CalendarComponent },
    {
        path: 'dashboard',
        component: DashboardLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardHome },
            { path: 'reservation', component: ReservationForm },
            { path: 'agenda', component: Agenda },
            { path: 'reservations', component: Reservations },
            { path: 'history', component: History },
            { path: 'profile', component: Profile },
            { path: 'settings', component: Settings }
        ]
    },
    { path: '**', redirectTo: '' } // Wildcard route for a 404 page
];
