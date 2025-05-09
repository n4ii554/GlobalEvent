import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://localhost:3000/api/eventos';  // URL de tu API Express

  constructor() {}

  // Método para obtener eventos
  getEventos(): Observable<any[]> {
    return new Observable((observer) => {
      fetch(this.apiUrl)
        .then(response => response.json())
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
