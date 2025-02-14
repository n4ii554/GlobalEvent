import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventoComponent } from "./pages/evento/evento.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GlobalEvent';
}
