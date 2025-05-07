import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'spotify',
    pathMatch: 'full'
  },
  {
    path: 'spotify',
    loadComponent: () => import('./_components/spotify-player/spotify-player.component').then(m => m.SpotifyPlayerComponent),
    title: 'Spotify Player'
  },
  {
    path: 'youtube',
    loadComponent: () => import('./_components/youtube-player/youtube-player.component').then(m => m.YouTubePlayerComponent),
    title: 'YouTube Player'
  },
  {
    path: 'settings',
    loadComponent: () => import('./_components/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Settings'
  },
  {
    path: 'error',
    loadComponent: () => import('./_components/error/error.component').then(m => m.ErrorComponent),
    title: 'Error'
  },
  {
    path: '**',
    redirectTo: 'error'
  }
]; 