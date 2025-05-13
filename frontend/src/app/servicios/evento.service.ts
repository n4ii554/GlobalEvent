import { Injectable } from '@angular/core';
import { Evento } from '../modelos/evento.model';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private apiUrl = 'http://localhost:3000/eventos';

  async obtenerEventos(): Promise<Evento[]> {
    const respuesta = await fetch(this.apiUrl);
    const datos = await respuesta.json();
    return datos.map((e: any) => ({ ...e, fechaEvento: new Date(e.fechaEvento) }));
  }

  async obtenerEvento(id: number): Promise<Evento> {
    const respuesta = await fetch(`${this.apiUrl}/${id}`);
    const dato = await respuesta.json();
    return { ...dato, fechaEvento: new Date(dato.fechaEvento) };
  }

  async añadirEvento(evento: Evento): Promise<Evento> {
    const cuerpo = { ...evento, fechaEvento: evento.fechaEvento.toISOString() };
    const respuesta = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
    const dato = await respuesta.json();
    return { ...dato, fechaEvento: new Date(dato.fechaEvento) };
  }

  async actualizarEvento(evento: Evento): Promise<Evento> {
    const cuerpo = { ...evento, fechaEvento: evento.fechaEvento.toISOString() };
    const respuesta = await fetch(`${this.apiUrl}/${evento.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
    const dato = await respuesta.json();
    return { ...dato, fechaEvento: new Date(dato.fechaEvento) };
  }

  async eliminarEvento(id: number): Promise<void> {
    await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
  }
}
