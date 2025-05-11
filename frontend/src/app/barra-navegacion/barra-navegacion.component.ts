import { Component } from '@angular/core';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css'
})
export class BarraNavegacionComponent {

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }
  
}
