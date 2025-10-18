import { Component } from '@angular/core';
import{ RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
@Component({
  selector: 'app-home',
  imports: [RouterOutlet,Header,RouterLink,Footer,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
