import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncuestaService } from '../../services/encuesta.service';
import { Encuesta } from '../../modelos/encuesta.model';
import { Evento } from '../../modelos/evento.model';
import { Pregunta } from '../../modelos/pregunta.model';
import { Opcion } from '../../modelos/opcion.model';

@Component({
  standalone: true,
  selector: 'app-encuestas-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './encuestas-admin.component.html',
  styleUrl: './encuestas-admin.component.css'
})
export class EncuestasAdminComponent implements OnInit {
  encuestas: Encuesta[] = [];
  eventos: Evento[] = [];

  encuestaActiva: Encuesta = {
    id: null,
    evento_id: 1,
    titulo: '',
    descripcion: '',
    preguntas: [{
      texto_pregunta: '',
      encuesta_id: null,
      opciones: [
        { texto_opcion: '', pregunta_id: 0 },
        { texto_opcion: '', pregunta_id: 0 },
        { texto_opcion: '', pregunta_id: 0 }
      ]
    }]
  };

ngOnInit() {
  this.cargarEventos();
  this.cargarEncuestas();

  if (!this.encuestaActiva.preguntas || this.encuestaActiva.preguntas.length === 0) {
    this.encuestaActiva.preguntas = [{
      texto_pregunta: '',
      encuesta_id: undefined,
      opciones: [
        { texto_opcion: '', pregunta_id: 0 },
        { texto_opcion: '', pregunta_id: 0 },
        { texto_opcion: '', pregunta_id: 0 }
      ]
    }];
  }
}

  getNombreEvento(evento_id: number): string {
  const evento = this.eventos.find(e => e.id === evento_id);
  return evento ? evento.nombreEvento : 'Evento no encontrado';
}


  async cargarEventos() {
    const res = await fetch('http://localhost:3000/api/eventos');
    this.eventos = await res.json();
    if (this.eventos.length > 0 && this.encuestaActiva.evento_id === 0) {
      this.encuestaActiva.evento_id = this.eventos[0].id!;
    }
  }

async cargarEncuestas() {
    const res = await fetch('http://localhost:3000/api/encuestas');
    this.encuestas = await res.json();
  }

  async guardarEncuesta() {
    console.log('guardarEncuesta() llamado');
  try {

    //Datos para la encuesta
    const encuestaData = {
      evento_id: this.encuestaActiva.evento_id,
      titulo: this.encuestaActiva.titulo,
      descripcion: this.encuestaActiva.descripcion,
    };

    // Guardar encuesta (PUT o POST)
    const urlEncuesta = this.encuestaActiva.id
      ? `http://localhost:3000/api/encuestas/${this.encuestaActiva.id}`
      : 'http://localhost:3000/api/encuestas';

    const methodEncuesta = this.encuestaActiva.id ? 'PUT' : 'POST';

    const resEncuesta = await fetch(urlEncuesta, {
      method: methodEncuesta,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encuestaData)
    });

    if (!resEncuesta.ok) {
      const errorData = await resEncuesta.json();
      alert(`Error guardando encuesta: ${errorData.error || resEncuesta.statusText}`);
      return;
    }

    //Obtener encuesta guardada con su ID
    const encuestaGuardada = await resEncuesta.json();
    console.log('Encuesta guardada:', encuestaGuardada);
    // Si la respuesta tiene id, úsalo
    if (encuestaGuardada.id) {
      this.encuestaActiva.id = encuestaGuardada.id;
    } else {
      // Si no, y si es actualización, el id ya estaba en encuestaActiva
      if (!this.encuestaActiva.id || this.encuestaActiva.id === 0) {
        alert('No se pudo obtener el ID de la encuesta guardada');
        return;
      }
      // Deja el id actual que ya tenía la encuestaActiva
    }

    //Tomar la pregunta
    const pregunta = this.encuestaActiva.preguntas?.[0];
    if (!pregunta) {
      alert('No hay pregunta para guardar');
      return;
    }

    if (!pregunta.encuesta_id) {
      alert('ID de encuesta no asignado a la pregunta');
      return;
    }

     //Asignar el encuesta_id correctamente
    pregunta.encuesta_id = this.encuestaActiva.id;

    //Validar que encuesta_id exista justo antes de guardar pregunta
    if (!pregunta.encuesta_id) {
      alert('ID de encuesta no asignado a la pregunta');
      return;
    }

    // Verifica que haya texto
    if (!pregunta.texto_pregunta?.trim()) {
      alert('La pregunta no puede estar vacía');
      return;
    }

    console.log('Pregunta a guardar:', pregunta);


    //Guardar pregunta
    const preguntaData = {
      texto_pregunta: pregunta.texto_pregunta,
      encuesta_id: pregunta.encuesta_id
    };

    const urlPregunta = pregunta.id
      ? `http://localhost:3000/api/preguntas/${pregunta.id}`
      : `http://localhost:3000/api/encuestas/${pregunta.encuesta_id}/preguntas`;

    const methodPregunta = pregunta.id ? 'PUT' : 'POST';

    const resPregunta = await fetch(urlPregunta, {
      method: methodPregunta,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preguntaData)
    });

    if (!resPregunta.ok) {
      const errorData = await resPregunta.json();
      alert(`Error guardando pregunta: ${errorData.error || resPregunta.statusText}`);
      return;
    }

    //Obtener pregunta guardada para asignar id
    const preguntaGuardada = await resPregunta.json();
    pregunta.id = preguntaGuardada.id;

    // Guardar opciones
    for (const opcion of pregunta.opciones!) {
      opcion.pregunta_id = pregunta.id; //Asignar pregunta_id

      const opcionData = {
        texto_opcion: opcion.texto_opcion,
        pregunta_id: opcion.pregunta_id
      };

      const urlOpcion = opcion.id
        ? `http://localhost:3000/api/opciones/${opcion.id}`
        : `http://localhost:3000/api/preguntas/${opcion.pregunta_id}/opciones`;

      const methodOpcion = opcion.id ? 'PUT' : 'POST';

      const resOpcion = await fetch(urlOpcion, {
        method: methodOpcion,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opcionData)
      });

      if (!resOpcion.ok) {
        const errorData = await resOpcion.json();
        alert(`Error guardando opción: ${errorData.error || resOpcion.statusText}`);
        return;
      }

      const opcionGuardada = await resOpcion.json();
      opcion.id = opcionGuardada.id;
    }

    alert('Encuesta guardada correctamente');
    this.cargarEncuestas();

  } catch (error: any) {
    alert('Error inesperado al guardar la encuesta');
    console.error('Error guardando encuesta:', error);
  }
}

async seleccionarEncuestaParaEditar(encuesta: Encuesta) {
  this.encuestaActiva = JSON.parse(JSON.stringify(encuesta));

  // Cargar preguntas de la encuesta
  const resPreguntas = await fetch(`http://localhost:3000/api/encuestas/${encuesta.id}/preguntas`);
  if (resPreguntas.ok) {
    const preguntas = await resPreguntas.json();

    console.log('Preguntas recibidas:', preguntas);

    this.encuestaActiva.preguntas = preguntas;

    // Cargar opciones por pregunta
    for (const pregunta of this.encuestaActiva.preguntas) {
      pregunta.encuesta_id = this.encuestaActiva.id;  
      const resOpciones = await fetch(`http://localhost:3000/api/preguntas/${pregunta.id}/opciones`);
      if (resOpciones.ok) {
        pregunta.opciones = await resOpciones.json();
        console.log(`Opciones para pregunta ${pregunta.id}:`, pregunta.opciones);
      } else {
        pregunta.opciones = [];
      }
    }
  } else {
    console.error('Error cargando preguntas');
    this.encuestaActiva.preguntas = [];
  }
}




async eliminarEncuesta(id: number) {
  const res = await fetch(`http://localhost:3000/api/encuestas/${id}`, { method: 'DELETE' });
  if (res.ok) {
    alert('Encuesta eliminada');
    await this.cargarEncuestas();
  } else {
    alert('Error eliminando encuesta');
  }
}

}