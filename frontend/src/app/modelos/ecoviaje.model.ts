export interface Ecoviaje {
  id?: number;
  usuario_id: number;
  ubicacionInicial: string;
  evento_id: number;
  fechaViaje: string;
  plazasDisponibles?: number;
  descripcion?: string;
}
