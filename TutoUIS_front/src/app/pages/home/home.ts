import { Component } from '@angular/core';
import{ RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet,RouterLink,Footer,CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

}
