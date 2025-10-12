import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { CalendarComponent } from './pages/calendar/calendar';
import { Dashboard } from './pages/dashboard/dashboard';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'calendar', component: CalendarComponent },
    { path: 'dashboard', component: Dashboard },
    { path: '**', redirectTo: '' } // Wildcard route for a 404 page

];
