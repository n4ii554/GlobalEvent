import { Pregunta } from '../modelos/pregunta.model';

export interface Encuesta {
  id: number | undefined | null;
  evento_id: number;
  titulo: string;
  descripcion?: string;
  fecha_creacion?: string;
  preguntas: Pregunta[]; // Opcional: incluir si quieres cargar todo junto
}
