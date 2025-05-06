import { Component, ElementRef, OnDestroy, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import YouTube from 'youtube-player';
import { PlayerService } from '../../_services/player.service';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class YouTubePlayerComponent implements OnDestroy {
  @ViewChild('playerContainer') private readonly playerContainer!: ElementRef;
  private player: any;
  private readonly playerService = inject(PlayerService);
  readonly youtube_ = this.playerService.youtube_;
  readonly accessToken_ = this.playerService.youtubeAccessToken_;

  constructor() {
    effect(() => {
      const accessToken = this.accessToken_();
      if (accessToken && this.playerContainer) {
        this.initializePlayer();
      }
    });

    effect(() => {
      const youtube = this.youtube_();
      if (this.player && youtube.videoId) {
        this.player.loadVideoById(youtube.videoId);
      }
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }

  private initializePlayer() {
    this.player = YouTube(this.playerContainer.nativeElement, {
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
    });

    this.player.on('stateChange', (event: any) => {
      if (event.data === 1) { // Playing
        this.playerService.setYoutubePlayback(true);
      } else if (event.data === 2) { // Paused
        this.playerService.setYoutubePlayback(false);
      }
    });
  }
} 