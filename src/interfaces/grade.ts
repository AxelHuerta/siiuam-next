export interface Grade {
  registro: string;
  codigo: string;
  nombre: string;
  trimestre: string;
  tipoEvaluacion: string;
  calificacion: Calificacion;
  acta: string;
  creditos: string;
}

export enum Calificacion {
  B = "B",
  MB = "MB",
  S = "S",
}
