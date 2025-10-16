import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HeaderGuest } from "./components/header-guest/header-guest";
import { NavigationGuardService } from './services/navigation-guard.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('TutoUIS_project');

  constructor(private navigationGuard: NavigationGuardService) {}

  ngOnInit(): void {
    // El NavigationGuardService se inicializa automáticamente
  }
}
