import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css',
})
export class BarraNavegacionComponent {
  usersService = inject(UsersService);
  private router = inject(Router);
  constructor(public auth: AuthService) {}

  /** controla la apertura del menú */
  menuOpen = false;

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation(); // evita que el HostListener cierre inmediatamente
    this.menuOpen = !this.menuOpen;
  }

  /** cierra al hacer clic fuera del componente */
  @HostListener('document:click') closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.menuOpen = false;
    this.auth.logout?.();            // si tu servicio lo implementa
    localStorage.removeItem('token'); // opcional
    this.router.navigate(['/']);
  }
}
