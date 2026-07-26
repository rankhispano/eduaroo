export type Recurso = {
  id: string;
  titulo: string;
  tipo: 'ejercicio' | 'video' | 'ficha' | 'juego' | 'lectura';
  url: string;
  descripcion?: string;
  duracion?: string;
};

export type Tema = {
  id: string;
  nombre: string;
  recursos: Recurso[];
};

export type AsignaturaId = 'lengua' | 'mates' | 'naturales' | 'sociales' | 'ingles';

export type Asignatura = {
  id: AsignaturaId;
  nombre: string;
  color: string;
  icono: string;
  temas: Tema[];
};

export type CursoId = '1' | '2' | '3' | '4' | '5' | '6';

export type Curso = {
  id: CursoId;
  nombre: string;
  asignaturas: Asignatura[];
};
