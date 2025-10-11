import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  usuario: string = 'Juan Pérez';
  notificaciones: number = 2;

  playNotifSound() {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b6c2b48.mp3');
    audio.volume = 0.5;
    audio.play();
  }
}
