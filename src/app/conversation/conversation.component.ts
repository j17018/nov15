import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit{
  @Input() obj:any;

  _emociones:any = [];

  @Input() audioUrl: string = "";

  constructor(private http: HttpClient) {}


  loadAudio() {
    // Set the URL of the WAV file from your Flask backend
    // this.audioUrl = 'http://localhost:5000/send-audio/'+this.obj["url_audio"]+".wav"; // Adjust as necessary
  }

  ngOnInit(): void {
    this.emocionesDesdeApiObtenerCadaUna();
    // this.loadAudio();
    console.log(this.audioUrl);
    console.log(this.obj["url_audio"]);
    this.audioUrl = this.obj["url_audio"]; // Adjust as necessary
  }

  // **Emoción:** Miedo\n\n**Sentimientos:**\n* Ansiedad\n* Inseguridad\n* Terror\n* Pánico\n* Preocupación"

  emocionesDesdeApiObtenerCadaUna(){
    let em:any = this.obj["emociones"].split(" ");
    for(let i = 0;i<em.length;i++){
      this._emociones.push(em[i].replaceAll("*",""));
      console.log(this._emociones);
    }
  }

  enviarDesconexion(){
    if (this.obj["respuesta"].includes("LINK PARA EL PAGO") == 1){
      return true;
    }else{
      return false;
    }

  }
}
