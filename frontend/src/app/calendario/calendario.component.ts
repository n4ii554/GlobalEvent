import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';  
import interactionPlugin from '@fullcalendar/interaction'; 
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-calendario',
  imports: [],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit, AfterViewInit {

  calendar: Calendar | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.http.get<any[]>('http://localhost:3000/api/eventos')  
    .subscribe(
      (data) => {
        console.log('Eventos recibidos:', data); 
        this.calendar = new Calendar(document.getElementById('calendar')!, {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin, interactionPlugin],
          events: data.map(evento => ({
            title: evento.nombreEvento,
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
