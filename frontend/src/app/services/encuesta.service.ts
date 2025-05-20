import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncuestaService {
  private apiUrl = 'http://localhost:3000/api/encuestas';

  // Obtener todas las encuestas
  async obtenerEncuestas(): Promise<any[]> {
    const res = await fetch(this.apiUrl);
    if (!res.ok) throw new Error('Error al obtener encuestas');
    return await res.json();
  }

  // Obtener una encuesta por ID
  async obtenerEncuesta(id: number): Promise<any> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    if (!res.ok) throw new Error('Encuesta no encontrada');
    return await res.json();
  }

  // Crear una nueva encuesta
  async crearEncuesta(encuesta: any): Promise<any> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encuesta),
    });
    if (!res.ok) throw new Error('Error al crear la encuesta');
    return await res.json();
  }

  // Enviar respuestas a una encuesta
  async enviarRespuestas(respuestas: any): Promise<void> {
    const res = await fetch(`${this.apiUrl}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(respuestas),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error('Error al enviar respuestas: ' + err);
    }
  }

  // Eliminar una encuesta
  async eliminarEncuesta(id: number): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar la encuesta');
  }

  // Actualizar encuesta
  async actualizarEncuesta(encuesta: any): Promise<any> {
    const res = await fetch(`${this.apiUrl}/${encuesta.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encuesta),
    });
    if (!res.ok) throw new Error('Error al actualizar encuesta');
    return await res.json();
  }
}
