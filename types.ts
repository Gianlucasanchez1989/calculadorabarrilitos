// FIX: Removed self-import of `Drink` which was causing a conflict with the `Drink` enum declaration.
export enum Drink {
  BEER = 'Cerveza',
  FERNET = 'Fernet',
  GIN = 'Gin',
}

export enum Season {
  SPRING_SUMMER = 'Primavera/Verano',
  AUTUMN_WINTER = 'Otoño/Invierno',
}

export interface FormData {
  attendees: number;
  drinks: Drink[];
  season: Season;
}

export interface DrinkCalculation {
  drink: Drink;
  liters: number;
  barrels: number;
}

export interface CalculationResult {
  breakdown: DrinkCalculation[];
  totalLiters: number;
  totalBarrels: number;
}