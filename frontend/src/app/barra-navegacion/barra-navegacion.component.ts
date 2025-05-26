import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';  // ⬅️ Ajusta la ruta si es necesario
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css'
})
export class BarraNavegacionComponent {
  usersService = inject(UsersService);  // ⬅️ Esta línea permite usar el servicio en el HTML
  constructor(public auth: AuthService) {}


  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }
}
