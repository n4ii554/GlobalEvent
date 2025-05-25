import { Injectable } from '@angular/core';
import { Publicacion } from '../modelos/publicacion.model';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  private apiUrl = 'http://localhost:3000/api/publicaciones';

  constructor() {}

  async obtenerPublicaciones(): Promise<Publicacion[]> {
    const response = await fetch(this.apiUrl);
    if (!response.ok) throw new Error('Error al obtener publicaciones');
    return response.json();
  }

  async obtenerPublicacion(id: number): Promise<Publicacion> {
    const response = await fetch(`${this.apiUrl}/${id}`);
    if (!response.ok) throw new Error('Publicación no encontrada');
    return response.json();
  }

  async crearPublicacion(publicacion: Publicacion): Promise<Publicacion> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicacion),
    });
    if (!response.ok) throw new Error('Error al crear publicación');
    return response.json();
  }

  async actualizarPublicacion(publicacion: Publicacion): Promise<Publicacion> {
    if (!publicacion.id) throw new Error('ID es requerido para actualizar');
    const response = await fetch(`${this.apiUrl}/${publicacion.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicacion),
    });
    if (!response.ok) throw new Error('Error al actualizar publicación');
    return response.json();
  }

  async eliminarPublicacion(id: number): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar publicación');
  }
}
