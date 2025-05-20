import { Opcion } from '../modelos/opcion.model';

export interface Pregunta {
  id?: number;
  encuesta_id: number | undefined | null;
  texto_pregunta: string;
  opciones?: Opcion[]; 
}
