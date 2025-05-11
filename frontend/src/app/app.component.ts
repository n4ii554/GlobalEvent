import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { BarraNavegacionComponent } from './barra-navegacion/barra-navegacion.component';// ajusta el path

@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    BarraNavegacionComponent,
    RouterModule,
    RouterOutlet // importante si estás usando <router-outlet>
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
