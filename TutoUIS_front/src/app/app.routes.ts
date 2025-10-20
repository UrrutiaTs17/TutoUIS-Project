import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { CalendarComponent } from './pages/calendar/calendar';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { DashboardLayout } from './pages/dashboard/layout/dashboard-layout';
import { DashboardHome } from './pages/dashboard/home/dashboard-home';
import { ReservationForm } from './pages/dashboard/reservation/reservation-form';
import { Reservations, History, Profile, Settings } from './pages/dashboard/sections/placeholder';
import { AdminLayout } from './pages/admin-dashboard/layout/admin-layout';
import { AdminHome } from './pages/admin-dashboard/sections/admin-home';
import { AdminUsers } from './pages/admin-dashboard/sections/admin-users';
import { AdminReservations, AdminSpaces, AdminReports, AdminSettings } from './pages/admin-dashboard/sections/admin-placeholders';

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
            { path: 'reservations', component: Reservations },
            { path: 'history', component: History },
            { path: 'profile', component: Profile },
            { path: 'settings', component: Settings }
        ]
    },
    { 
        path: 'admin-dashboard', 
        component: AdminLayout,
        canActivate: [AdminGuard],
        children: [
            { path: '', component: AdminHome },
            { path: 'users', component: AdminUsers },
            { path: 'reservations', component: AdminReservations },
            { path: 'spaces', component: AdminSpaces },
            { path: 'reports', component: AdminReports },
            { path: 'settings', component: AdminSettings }
        ]
    },
    { path: '**', redirectTo: '' } // Wildcard route for a 404 page
];
