import { Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  token : any;
  constructor() { }

  /**
   * En base al token que hay en el localStorage 
   * Podemos con estos metodos mirar si esta logueado, si es organizador y si es admin
   * Para poder hacer y acceder a las cosas
   * @returns 
   */

  isLogged() : boolean{
    return localStorage.getItem('token') ? true : false;
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    const respuesta = await fetch(this.apiUrl);
    const datos = await respuesta.json();
    return datos.map((u: any) => ({
      ...u,
      fecha_creacion: new Date(u.fecha_creacion).toISOString(),
    }));
  }

  async obtenerUsuario(id: number): Promise<Usuario> {
    const respuesta = await fetch(`${this.apiUrl}/${id}`);
    const dato = await respuesta.json();
    return {
      ...dato,
      fecha_creacion: new Date(dato.fecha_creacion).toISOString(),
    };
  }

  async añadirUsuario(usuario: Usuario): Promise<Usuario> {
    if (!usuario.nombre_usuario || !usuario.email || !usuario.contrasena) {
      throw new Error('Faltan campos obligatorios');
    }

    const cuerpo = {
      ...usuario,
      fecha_creacion: new Date().toISOString(),
    };

    const respuesta = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });

    if (!respuesta.ok) {
      const errorTexto = await respuesta.text();
      throw new Error('Error al crear usuario: ' + errorTexto);
    }

    return await respuesta.json();
  }

  async actualizarUsuario(usuario: Usuario): Promise<Usuario> {
    if (!usuario.id) {
      throw new Error('ID requerido para actualizar');
    }

    const cuerpo = {
      ...usuario,
      fecha_creacion: new Date(usuario.fecha_creacion).toISOString(),
    };

    const respuesta = await fetch(`${this.apiUrl}/${usuario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });

    if (!respuesta.ok) {
      const errorTexto = await respuesta.text();
      throw new Error('Error al actualizar usuario: ' + errorTexto);
    }

    return await respuesta.json();
  }

  async eliminarUsuario(id: number): Promise<void> {
    const respuesta = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!respuesta.ok) {
      const errorTexto = await respuesta.text();
      throw new Error('Error al eliminar usuario: ' + errorTexto);
    }
  }
}