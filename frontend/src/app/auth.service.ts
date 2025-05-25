import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'

type Payload = { nombre_usuario: string; exp: number };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /* Ajusta la URL si tu endpoint es distinto */
  private apiUrl = 'http://localhost:3000/login';
  private storageKey = 'token';         // nombre de la clave en localStorage

  constructor(private http: HttpClient) {}

  /* ============  MÉTODOS PÚBLICOS  ============ */

  /** Llama al backend para hacer login y guarda el token */
  login(credenciales: { nombre_usuario: string; contrasena: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credenciales).pipe(
      tap(res => this.token = res.token)           // guarda automáticamente
    );
  }

  /** Borra el token → “logout” */
  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  /** Devuelve true si existe token y no ha expirado */
  isLogged(): boolean {
    if (!this.token) return false;
    const { exp } = this.decode();
    return Date.now() < exp * 1000;
  }

  /** Devuelve true solo si el nombre de usuario es 'admin' */
  isAdmin(): boolean {
    if (!this.token) return false;
    const { nombre_usuario } = this.decode();
    return nombre_usuario === 'admin';
  }

  /* ============  GETTERS / SETTERS  ============ */

  get token(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  set token(t: string | null) {
    if (t) localStorage.setItem(this.storageKey, t);
    else   localStorage.removeItem(this.storageKey);
  }

  /* ============  PRIVADOS  ============ */

  /** Decodifica el JWT (ya validado) */
  private decode(): Payload {
    return jwtDecode<Payload>(this.token!);
  }
}
