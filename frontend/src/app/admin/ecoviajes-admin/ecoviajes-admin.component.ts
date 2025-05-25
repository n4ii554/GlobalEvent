import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EcoviajeService } from '../../services/ecoviaje.service';
import { Ecoviaje } from '../../modelos/ecoviaje.model';
import { UsersService } from '../../services/users.service';
import { Usuario } from '../../modelos/usuario.model';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../modelos/evento.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-ecoviajes-admin',
  templateUrl: 'ecoviajes-admin.component.html',
  styleUrls: ['ecoviajes-admin.component.css']
})
export class EcoviajesAdminComponent implements OnInit {

  ecoviajes: Ecoviaje[] = [];
  nuevoEcoViaje: Ecoviaje = {
    usuario_id: 0,
    evento_id: 0,
    ubicacionInicial: '',
    plazasDisponibles: undefined,
    fechaViaje: this.getFechaHoyString()
  };

  usuarios: Usuario[] = [];
  eventos: Evento[] = [];
  ecoViajeSeleccionado: Ecoviaje | null = null;

  constructor(
    private EcoviajeService: EcoviajeService,
    private usersService: UsersService,
    private eventoService: EventoService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarEcoviajes();

    try {
      this.usuarios = await this.usersService.obtenerUsuarios();
      this.eventos = await this.eventoService.obtenerEventos(); 
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  } 

  async cargarEcoviajes(): Promise<void> {
    this.ecoviajes = await this.EcoviajeService.obtenerEcoviajes();
  }

  editarEcoViaje(ecoViaje: Ecoviaje): void {
    this.ecoViajeSeleccionado = { ...ecoViaje };
  }

  async guardarEcoViaje(): Promise<void> {
    if (this.ecoViajeSeleccionado) {
      await this.EcoviajeService.actualizarEcoviaje(this.ecoViajeSeleccionado);
      this.ecoViajeSeleccionado = null;
    } else {
      await this.EcoviajeService.añadirEcoviaje(this.nuevoEcoViaje);
      this.nuevoEcoViaje = {
        usuario_id: 0,
        evento_id: 0,
        ubicacionInicial: '',
        plazasDisponibles: undefined,
        fechaViaje: this.getFechaHoyString()
      };
    }
    await this.cargarEcoviajes();
  }

  getFechaHoyString(): string {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


  async eliminarEcoViaje(id: number): Promise<void> {
    await this.EcoviajeService.eliminarEcoviaje(id);
    await this.cargarEcoviajes();
  }
}
