// src/app/landing/landing.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { EventoService } from '../services/evento.service';
import { Evento }        from '../modelos/evento.model';
import { ContadorComponent } from './contador.component';   // ajusta la ruta si lo guardaste en otro sitio

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, ContadorComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  /** cards y carrusel (6 aleatorios) */
  eventos: Evento[] = [];

  /** para el contador regresivo */
  eventoProximo?: Evento;

  /** índice del slide activo */
  current = 0;
  private timer?: ReturnType<typeof setInterval>;

  /** modelo del formulario de contacto */
  contacto = {
    nombre:    '',
    apellidos: '',
    email:     '',
    telefono:  '',
    mensaje:   ''
  };

  constructor(private eventoService: EventoService) {}

  /* ----------------------------------------------------------- */
  async ngOnInit() {
    try {
      const lista = await this.eventoService.obtenerEventos();

      /* 1. barajar y tomar 6 */
      this.eventos = this.shuffle(lista).slice(0, 6);

      /* 2. calcular el próximo evento */
      const hoy = Date.now();
      this.eventoProximo = [...lista]
        .filter(e => +new Date(e.fechaEvento) >= hoy)
        .sort((a, b) => +new Date(a.fechaEvento) - +new Date(b.fechaEvento))[0];

      /* 3. autoplay carrusel */
      this.timer = setInterval(() => this.next(), 4000);

    } catch (e) {
      console.error('Error cargando eventos:', e);
    }
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  /* ----------------------------------------------------------- */
  next() { this.current = (this.current + 1) % this.eventos.length; }
  prev() { this.current = (this.current - 1 + this.eventos.length) % this.eventos.length; }

  enviar() {
    console.log('Formulario de contacto enviado', this.contacto);
    // TODO: enviar a tu backend /api/contacto
    this.contacto = { nombre:'', apellidos:'', email:'', telefono:'', mensaje:'' };
    alert('¡Gracias por tu mensaje!');
  }

  /** Baraja con Fisher-Yates */
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
