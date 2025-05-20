import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosAdminComponent } from './eventos-admin/eventos-admin.component';
import { UsuariosAdminComponent } from './usuarios-admin/usuarios-admin.component';
import { EncuestasAdminComponent } from './encuestas-admin/encuestas-admin.component';


@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, EventosAdminComponent, UsuariosAdminComponent, EncuestasAdminComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  seccionActiva: 'usuarios' | 'eventos' | 'encuestas' | null = null;

  seleccionarSeccion(seccion: 'usuarios' | 'eventos' | 'encuestas' ) {
    this.seccionActiva = seccion;
  }
}
