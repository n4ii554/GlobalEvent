import { Component, OnInit } from '@angular/core';
import { EventoService } from '../servicios/evento.service';
import { Evento } from '../modelos/evento.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})

export class AdminComponent implements OnInit {
  eventos: Evento[] = [];
  nuevoEvento: Evento = { id: 0, nombreEvento: '', fechaEvento: new Date(), tipoEvento: '' };
  eventoSeleccionado: Evento | null = null;

  constructor(private eventoService: EventoService) {}

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
      await this.eventoService.añadirEvento(this.nuevoEvento);
      this.nuevoEvento = { id: 0, nombreEvento: '', fechaEvento: new Date(), tipoEvento: '' };
    }
    await this.cargarEventos();
  }

  async eliminarEvento(id: number): Promise<void> {
    await this.eventoService.eliminarEvento(id);
    await this.cargarEventos();
  }
}

