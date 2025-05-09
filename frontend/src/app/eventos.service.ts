import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://localhost:3000/api/eventos';  // URL de la API de eventos

  constructor(private http: HttpClient) { }

  // Obtener eventos
  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear evento
  crearEvento(evento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, evento);
  }

  // Actualizar evento
  actualizarEvento(id: number, evento: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, evento);
  }

  // Eliminar evento
  eliminarEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
