import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Calendar } from './pages/calendar/calendar';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'calendar', component: Calendar },
    { path: '**', redirectTo: '' } // Wildcard route for a 404 page

];
