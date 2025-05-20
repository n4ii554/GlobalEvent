import { Injectable } from '@angular/core';
import { Ecoviaje } from '../modelos/ecoviaje.model';

@Injectable({
  providedIn: 'root'
})
export class EcoviajeService {
  private apiUrl = 'http://localhost:3000/api/ecoviajes';


  constructor() {}

  async obtenerEcoviajes(): Promise<Ecoviaje[]> {
  try {
    const respuesta = await fetch(this.apiUrl);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
    }
    const datos = await respuesta.json();
    console.log('Datos recibidos:', datos);
    return datos;
  } catch (error) {
    console.error('Error al obtener eco-viajes:', error);
    throw error;
  }
}


  async añadirEcoviaje(viaje: Ecoviaje): Promise<Ecoviaje> {
    const respuesta = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(viaje)
    });
    if (!respuesta.ok) {
      throw new Error('Error al añadir eco-viaje');
    }
    return await respuesta.json();
  }

  async actualizarEcoviaje(viaje: Ecoviaje): Promise<Ecoviaje> {
    if (!viaje.id) {
      throw new Error('El eco-viaje no tiene ID');
    }
    const respuesta = await fetch(`${this.apiUrl}/${viaje.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(viaje)
    });
    if (!respuesta.ok) {
      throw new Error('Error al actualizar eco-viaje');
    }
    return await respuesta.json();
  }

  async eliminarEcoviaje(id: number): Promise<void> {
    const respuesta = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    if (!respuesta.ok) {
      throw new Error('Error al eliminar eco-viaje');
    }
  }
}
