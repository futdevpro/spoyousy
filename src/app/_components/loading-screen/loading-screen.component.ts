import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingScreenComponent implements OnInit {
  @Input() version!: string;
  @Input() appName!: string;
  @Input() buildTimestamp!: string;
  iconPath = 'assets/icon.png';

  ngOnInit() {
    console.log('🎬 LoadingScreen component mounted with configuration:', {
      version: this.version,
      appName: this.appName,
      buildTimestamp: this.buildTimestamp
    });
  }

  onLogoLoad() {
    console.log('✨ Logo image loaded and displayed successfully');
  }

  onLogoError(error: Event) {
    console.error('💥 Logo image loading failed:', error);
  }
} 