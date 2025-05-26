import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { EventoService } from '../services/evento.service';
import { Evento } from '../modelos/evento.model';

@Component({
  selector: 'app-eventos',
  standalone: true,             
  imports: [CommonModule],      
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']       
})
export class EventosComponent {

  eventos: Evento[] = [];

  constructor(private eventoService: EventoService) {}

  async ngOnInit() {
    try {
      this.eventos = await this.eventoService.obtenerEventos() as Evento[];
    } catch (e) {
      console.error('Error cargando eventos:', e);
    }
  }
}
