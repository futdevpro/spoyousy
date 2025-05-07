import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private isFirstPlay = true;

  playAudio(path: string): void {
    console.log('🎵 Playing audio:', path);
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(path);

    // Only try to autoplay on first load
    if (this.isFirstPlay) {
      this.audio.play().catch(error => {
        console.log('ℹ️ Autoplay prevented by browser, will play on next user interaction');
        // Add click listener to document to play on first user interaction
        const playOnInteraction = () => {
          this.audio?.play().catch(e => console.error('💥 Error playing audio:', e));
          document.removeEventListener('click', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
      });
      this.isFirstPlay = false;
    } else {
      // For subsequent plays, we'll need user interaction
      console.log('ℹ️ Waiting for user interaction to play audio');
      const playOnInteraction = () => {
        this.audio?.play().catch(e => console.error('💥 Error playing audio:', e));
        document.removeEventListener('click', playOnInteraction);
      };
      document.addEventListener('click', playOnInteraction);
    }
  }

  stopAudio(): void {
    console.log('⏹️ Stopping audio playback');
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
} 