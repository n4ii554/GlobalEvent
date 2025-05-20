import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../modelos/publicacion.model';
import { FormsModule } from '@angular/forms';
import { PublicacionService } from '../../services/publicacion.service';
import { UsersService } from '../../services/users.service';
import { Usuario } from '../../modelos/usuario.model';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../modelos/evento.model';

@Component({
  standalone: true,
  selector: 'app-publicaciones-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './publicaciones-admin.component.html',
  styleUrls: ['./publicaciones-admin.component.css']
})
export class PublicacionesAdminComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  publicacionSeleccionada: Publicacion | null = null;

  usuarios: Usuario[] = [];
  eventos: Evento[] = [];

  nuevoPublicacion: Publicacion = {
    usuario_id: 0,
    evento_id: 0,
    titulo: '',
    contenido: '',
    fecha_publicacion: this.getFechaHoyString()
  };

  errorMessage = '';

  constructor(
    private publicacionService: PublicacionService,
    private usersService: UsersService,
    private eventoService: EventoService
  ) {}

  async ngOnInit(): Promise <void> {
    this.cargarPublicaciones();

    try {
      this.usuarios = await this.usersService.obtenerUsuarios();
      this.eventos = await this.eventoService.obtenerEventos(); 
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  }

  getFechaHoyString(): string {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async cargarPublicaciones() {
    try {
      this.publicaciones = await this.publicacionService.obtenerPublicaciones();
      this.errorMessage = '';
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al cargar publicaciones';
    }
  }

  seleccionarParaEditar(pub: Publicacion) {
    this.publicacionSeleccionada = { ...pub };
  }

  async guardarPublicacion() {
    try {
      if (this.publicacionSeleccionada) {
        // Actualizar la fecha de publicación antes de enviar
        this.publicacionSeleccionada.fecha_publicacion = this.getFechaHoyString();
        await this.publicacionService.actualizarPublicacion(this.publicacionSeleccionada);
      } else {
        // Actualizar la fecha para el nuevo antes de crear
        this.nuevoPublicacion.fecha_publicacion = this.getFechaHoyString();
        await this.publicacionService.crearPublicacion(this.nuevoPublicacion);
      }

      this.publicacionSeleccionada = null;
      this.nuevoPublicacion = {
        usuario_id: 0,
        evento_id: 0,
        titulo: '',
        contenido: '',
        fecha_publicacion: this.getFechaHoyString()
      };

      await this.cargarPublicaciones();
      this.errorMessage = '';
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al guardar publicación';
    }
  }

  cancelarEdicion() {
    this.publicacionSeleccionada = null;
    this.errorMessage = '';
  }

  async eliminarPublicacion(id: number) {
    if (!confirm('¿Estás seguro que quieres eliminar esta publicación?')) return;
    try {
      await this.publicacionService.eliminarPublicacion(id);
      await this.cargarPublicaciones();
      this.errorMessage = '';
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al eliminar publicación';
    }
  }
}
