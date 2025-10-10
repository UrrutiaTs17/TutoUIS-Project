import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import{ RouterLink, RouterOutlet } from '@angular/router';
import { Login } from '../login/login';
@Component({
  selector: 'app-home',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
