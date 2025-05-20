import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosAdminComponent } from './eventos-admin/eventos-admin.component';
import { UsuariosAdminComponent } from './usuarios-admin/usuarios-admin.component';
import { EncuestasAdminComponent } from './encuestas-admin/encuestas-admin.component';
import { EcoviajesAdminComponent } from './ecoviajes-admin/ecoviajes-admin.component';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, EventosAdminComponent, UsuariosAdminComponent, EncuestasAdminComponent, EcoviajesAdminComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  seccionActiva: 'usuarios' | 'eventos' | 'encuestas' | 'ecoviajes' | null = null;

  seleccionarSeccion(seccion: 'usuarios' | 'eventos' | 'encuestas' | 'ecoviajes' ) {
    this.seccionActiva = seccion;
  }
}
