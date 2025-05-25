// src/app/contador/contador.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

interface Tiempo {
    dias: number;
    horas: number;
    min: number;
    seg: number;
}

@Component({
    selector: 'app-contador',
    standalone: true,
    imports: [CommonModule, DatePipe],
    template: `
    <div *ngIf="restante" class="countdown">
      <h2 class="count-title">Próximo evento en…</h2>

      <div class="boxes">
        <span><strong>{{ restante.dias }}</strong><small>días</small></span>
        <span><strong>{{ restante.horas }}</strong><small>horas</small></span>
        <span><strong>{{ restante.min }}</strong><small>min</small></span>
        <span><strong>{{ restante.seg }}</strong><small>seg</small></span>
      </div>

      <p class="next-name">{{ nombreEvento }}</p>
      <p class="next-date">({{ fecha | date:'fullDate' }})</p>
    </div>
  `,
    styleUrls: ['./contador.component.css']
})
export class ContadorComponent implements OnInit, OnDestroy {

    /** Fecha del evento en formato ISO o 'yyyy-MM-dd' */
    @Input() fecha!: string;

    /** Nombre del evento (se mostrará debajo del contador) */
    @Input() nombreEvento = '';

    restante!: Tiempo | null;
    private timer!: ReturnType<typeof setInterval>;

    ngOnInit() {
        this.actualizar();
        this.timer = setInterval(() => this.actualizar(), 1000);
    }

    ngOnDestroy() {
        clearInterval(this.timer);
    }

    private actualizar() {
        const diff = +new Date(this.fecha) - Date.now();
        if (diff < 0) { this.restante = null; return; }

        this.restante = {
            dias: Math.floor(diff / 8.64e7),
            horas: Math.floor(diff / 3.6e6) % 24,
            min: Math.floor(diff / 6e4) % 60,
            seg: Math.floor(diff / 1e3) % 60
        };
    }
}
