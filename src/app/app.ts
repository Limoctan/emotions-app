import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmotionWheelComponent } from './components/emotion-wheel/emotion-wheel.component';

@Component({
  selector: 'app-root',
  imports: [EmotionWheelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('emotions-app');

  protected readonly activeEmotions = signal({
    happy: false,
    sad: false,
    angry: false,
    surprised: false
  });

  protected readonly centerText = signal('');

  toggleEmotion(emotion: 'happy' | 'sad' | 'angry' | 'surprised') {
    this.activeEmotions.update(current => ({
      ...current,
      [emotion]: !current[emotion]
    }));
  }

  updateText(event: Event) {
    const input = event.target as HTMLInputElement;
    this.centerText.set(input.value);
  }
}
