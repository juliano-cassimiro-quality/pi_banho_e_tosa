export interface Pet {
  id: number;
  nome: string;
  especie: string;
  porte: string;
  idade: number | null;
  observacoesSaude: string | null;
  preferencias: string | null;
}
