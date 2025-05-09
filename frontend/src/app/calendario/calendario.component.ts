import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';  
import interactionPlugin from '@fullcalendar/interaction'; 
import { EventosService } from '../eventos.service';  // Importa tu servicio

@Component({
  selector: 'app-calendario',
  imports: [],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit, AfterViewInit {

  calendar: Calendar | undefined;
  
  
  constructor(private eventosService: EventosService) { }  

  ngOnInit(): void {}

  ngAfterViewInit() {
    fetch('http://localhost:3000/api/eventos')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })

    .then((data: any[]) => {
      console.log('Eventos recibidos:', data);

        this.calendar = new Calendar(document.getElementById('calendar')!, {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin, interactionPlugin],
          events: data.map((evento: any) => ({
            title: evento.nombreEvento.replace(/^\d+\s*/, ''), 
            date: evento.fechaEvento
          }))
        });

        this.calendar.render();  // Renderiza el calendario con los eventos obtenidos
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
  }

}
