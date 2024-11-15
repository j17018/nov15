import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from '../conversation/conversation.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports:[CommonModule,ConversationComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];
  public audioUrl?: string;
  public isRecording: boolean = false; // Track recording state

  constructor(private http: HttpClient) {}

  conversations:any = [];

  async requestMicrophoneAccess(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Microphone access denied');
    }
  }

  async startRecording() {
    const stream = await this.requestMicrophoneAccess();
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = event => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.start();
    this.isRecording = true; // Update recording state
  }

  async stopRecording() {
    return new Promise<void>(resolve => {
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(audioBlob); // Create a URL for playback
        this.audioChunks = []; // Reset for next recording
        
        // Send audioBlob to API
        await this.uploadAudio(audioBlob);
        
        resolve();
      };
      this.mediaRecorder.stop();
      this.isRecording = false; // Update recording state
    });
  }

  async uploadAudio(blob: Blob) {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav'); // Append the blob with a filename

    try {
      const response:any = await this.http.post('http://172.16.51.229:5000/upload', formData).toPromise();
      let conversation : any = {"emociones":response["emociones"],"entrada":response["entrada"], "respuesta":response["respuesta"] ,"url_audio":response["url_audio"]};
      this.conversations.push(conversation);
      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
}
