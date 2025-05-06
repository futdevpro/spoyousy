import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './_components/loading-screen/loading-screen.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { YouTubePlayerComponent } from './_components/youtube-player/youtube-player.component';
import { SpotifyPlayerComponent } from './_components/spotify-player/spotify-player.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900">Music Player</h1>
        <p class="mt-2 text-lg text-gray-600">Listen to your favorite music from YouTube and Spotify</p>
      </header>
      <app-loading-screen></app-loading-screen>
      <app-settings></app-settings>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <app-youtube-player></app-youtube-player>
        <app-spotify-player></app-spotify-player>
      </div>
    </div>
  `,
  styles: [`
    :host {
      @apply block min-h-screen bg-gray-100;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    LoadingScreenComponent,
    SettingsComponent,
    YouTubePlayerComponent,
    SpotifyPlayerComponent
  ]
})
export class AppComponent {
  title = 'music-player';
} 