import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  usuario: string = '';
  notificaciones: number = 2;
  userData: LoginResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userData = this.authService.getUserData();
    this.usuario = this.userData?.codigo || 'Usuario';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  playNotifSound() {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b6c2b48.mp3');
    audio.volume = 0.5;
    audio.play();
  }
}
