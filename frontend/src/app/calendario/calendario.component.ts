import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';  
import interactionPlugin from '@fullcalendar/interaction'; 

@Component({
  selector: 'app-calendario',
  imports: [],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit, AfterViewInit {

  calendar: Calendar | undefined;

  ngOnInit(): void {}

  // Aquí es donde se inicializa FullCalendar
  ngAfterViewInit() {
    // Inicializa el calendario después de que la vista esté completamente cargada
    this.calendar = new Calendar(document.getElementById('calendar')!, {
      initialView: 'dayGridMonth',  // Puedes cambiar la vista (dayGridMonth, listWeek, etc.)
      plugins: [dayGridPlugin, interactionPlugin],
      events: [
        { title: 'Evento 1', date: '2025-05-10' },
        { title: 'Evento 2', date: '2025-05-15' },
      ],
     
    });

    this.calendar.render();  // Renderiza el calendario en el div
  }

}
