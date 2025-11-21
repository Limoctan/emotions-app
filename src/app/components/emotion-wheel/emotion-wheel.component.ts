import { Component, input, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';

export interface ActiveEmotions {
  happy: boolean;
  sad: boolean;
  angry: boolean;
  surprised: boolean;
}

@Component({
  selector: 'app-emotion-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'emotion-wheel.component.html',
  styleUrl: 'emotion-wheel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmotionWheelComponent {
  private geminiService = inject(GeminiService);

  isAnalyzing = signal(false);

  activeEmotions = signal<ActiveEmotions>({
    happy: false,
    sad: false,
    angry: false,
    surprised: false
  });

  centerText = signal<string>('');
  imageSrc = signal<string | null>(null);

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isAnalyzing.set(true);
      this.imageSrc.set(URL.createObjectURL(file));

      try {
        const result = await this.geminiService.analyzeImage(file);
        this.activeEmotions.set(result);
      } catch (error) {
        console.error('Analysis failed', error);
      } finally {
        this.isAnalyzing.set(false);
      }
    }
  }
}
