import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { CalendarComponent } from './pages/calendar/calendar';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'calendar', component: CalendarComponent },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' } // Wildcard route for a 404 page
];
