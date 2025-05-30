import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../modelos/evento.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-eventos-admin',
  templateUrl: './eventos-admin.component.html',
  styleUrls: ['./eventos-admin.component.css'],
  
})

export class EventosAdminComponent implements OnInit {

  eventos: Evento[] = [];
  nuevoEvento: Evento = { nombreEvento: '', fechaEvento: this.getFechaHoyString(), tipoEvento: '' };
  eventoSeleccionado: Evento | null = null;

  eventoForm: Evento = { nombreEvento: '', fechaEvento: '', tipoEvento: '' };


  constructor(private eventoService: EventoService) {}

  getFechaHoyString(): string {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dd = hoy.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  

  async ngOnInit(): Promise<void> {
    await this.cargarEventos();
  }

  async cargarEventos(): Promise<void> {
    this.eventos = await this.eventoService.obtenerEventos();
  }

  editarEvento(evento: Evento): void {
    this.eventoSeleccionado = { ...evento };
  }

  async guardarEvento(): Promise<void> {
    if (this.eventoSeleccionado) {
      await this.eventoService.actualizarEvento(this.eventoSeleccionado);
      this.eventoSeleccionado = null;
    } else {
      console.log('Evento a enviar:', this.nuevoEvento);
      await this.eventoService.añadirEvento(this.nuevoEvento);
      this.nuevoEvento = { nombreEvento: '', fechaEvento: this.getFechaHoyString(), tipoEvento: '' };
    }
    await this.cargarEventos();
  }

  async eliminarEvento(id: number): Promise<void> {
    await this.eventoService.eliminarEvento(id);
    await this.cargarEventos();
  }


}
