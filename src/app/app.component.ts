import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingScreenComponent } from './_components/loading-screen/loading-screen.component';
import { PlayerService } from './_services/player.service';
import { AudioService } from './_services/audio.service';

/**
 * Root component of the SpoYouSy application.
 * Handles the initial loading screen and app initialization.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingScreenComponent],
  template: `
    @if (playerService.loading_()) {
      <app-loading-screen 
        [version]="'1.0.0'"
        [appName]="title"
        [buildTimestamp]="buildTimestamp"
      />
    }
    <router-outlet />
  `
})
export class AppComponent implements OnInit {
  title = 'SpoYouSy';
  buildTimestamp = new Date().toISOString();
  playerService = inject(PlayerService);
  audioService = inject(AudioService);

  /**
   * Initializes the application.
   * Plays the startup sound and sets up the initial loading state.
   */
  ngOnInit() {
    console.log('🚀 App component initialized');
    try {
      // Play start sound
      console.log('🎵 Playing startup sound');
      this.audioService.playAudio('assets/start_hehe.mp3');

      // Set loading to false after a short delay to ensure everything is loaded
      console.log('⏳ Setting up initial loading state');
      setTimeout(() => {
        this.playerService.setLoading(false);
        console.log('✅ Initial loading state completed');
      }, 1000);
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      // Ensure loading state is set to false even if there's an error
      this.playerService.setLoading(false);
      throw error;
    }
  }
} 