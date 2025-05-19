import { Injectable } from '@angular/core';
import { Evento } from '../modelos/evento.model';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private apiUrl = 'http://localhost:3000/api/eventos';

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
    if (!evento.fechaEvento || evento.fechaEvento.trim() === '') {
    throw new Error('FechaEvento está vacía o no es válida');
  }

  const formatearFecha = (fecha: Date): string => {
    const yyyy = fecha.getFullYear();
    const mm = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dd = fecha.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const fechaDate = new Date(evento.fechaEvento);
  if (isNaN(fechaDate.getTime())) {
    throw new Error('FechaEvento no es una fecha válida');
  }

  const cuerpo = {
    ...evento,
    fechaEvento: formatearFecha(fechaDate),
 
  };

    const respuesta = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });

    if (!respuesta.ok) {
  const errorTexto = await respuesta.text();
  throw new Error('Error en el servidor: ' + errorTexto);
}

const eventoCreado = await respuesta.json();
return eventoCreado;
    //const dato = await respuesta.json();
    //return { ...dato, fechaEvento: new Date(dato.fechaEvento) };
  }

  async actualizarEvento(evento: Evento): Promise<Evento> {
    const fechaDate = new Date(evento.fechaEvento);
    if (isNaN(fechaDate.getTime())) {
      throw new Error('FechaEvento no es una fecha válida');
    }

    const formatearFecha = (fecha: Date): string => {
    const yyyy = fecha.getFullYear();
    const mm = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dd = fecha.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

    const cuerpo = {
      ...evento,
     fechaEvento: formatearFecha(fechaDate),
    };

    const respuesta = await fetch(`${this.apiUrl}/${evento.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
    const dato = await respuesta.json();
    return { ...dato, fechaEvento: new Date(dato.fechaEvento) };
  }

  async eliminarEvento(id: number): Promise<void> {
    const respuesta = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
 
     if (!respuesta.ok) {
    const errorTexto = await respuesta.text();
    throw new Error('Error eliminando evento: ' + errorTexto);
  }

  }
}
