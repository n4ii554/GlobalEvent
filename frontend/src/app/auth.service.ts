import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Necesitas HttpClient para hacer solicitudes
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/login';  // Asegúrate de que esta URL coincida con la del backend

  constructor(private http: HttpClient) {}

  login(usuario: { nombre_usuario: string, contrasena: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);  // Hacemos un POST al backend para hacer login
  }
}
