import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";
import { ActiveEmotions } from '../components/emotion-wheel/emotion-wheel.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    // Initialize Gemini with the API key
    this.genAI = new GoogleGenAI({ apiKey: environment.geminiApiKey });
  }

  async analyzeImage(imageFile: File): Promise<ActiveEmotions> {
    try {
      const imageData = await this.fileToGenerativePart(imageFile);

      const prompt = `Analyze this image and rate the following emotions from 0 to 20: happy, sad, angry, surprised.
      Return ONLY a JSON object with these keys and integer values.
      Example: { "happy": 15, "sad": 2, "angry": 0, "surprised": 5 }`;

      const result = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          imageData,
          { text: prompt }
        ],
      });
      const text = result.text!;
      console.log(text);

      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      console.log(cleanedText);

      const scores = JSON.parse(cleanedText);

      return {
        happy: (scores.happy || 0) > 10,
        sad: (scores.sad || 0) > 10,
        angry: (scores.angry || 0) > 10,
        surprised: (scores.surprised || 0) > 10
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Return default state on error
      return {
        happy: false,
        sad: false,
        angry: false,
        surprised: false
      };
    }
  }

  private async fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];

        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
