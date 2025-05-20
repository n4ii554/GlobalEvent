import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Usuario } from '../../modelos/usuario.model';

@Component({
  standalone: true,
  selector: 'app-usuarios-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {
  
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = {
    nombre_usuario: '',
    email: '',
    contrasena: '',
    fecha_creacion: this.getFechaHoyString()
  };
  usuarioSeleccionado: Usuario | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  getFechaHoyString(): string {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dd = hoy.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async cargarUsuarios(): Promise<void> {
    this.usuarios = await this.usersService.obtenerUsuarios();
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  async guardarUsuario(): Promise<void> {
    if (this.usuarioSeleccionado) {
      await this.usersService.actualizarUsuario(this.usuarioSeleccionado);
      this.usuarioSeleccionado = null;
    } else {
      await this.usersService.añadirUsuario(this.nuevoUsuario);
      this.nuevoUsuario = {
        nombre_usuario: '',
        email: '',
        contrasena: '',
        fecha_creacion: this.getFechaHoyString()
      };
    }
    await this.cargarUsuarios();
  }

  async eliminarUsuario(id: number): Promise<void> {
    await this.usersService.eliminarUsuario(id);
    await this.cargarUsuarios();
  }

  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
  }
}