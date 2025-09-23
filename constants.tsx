import React from 'react';
import { Drink, Season } from './types';

// --- Calculation Constants ---

/**
 * Litros estimados por persona, basado en la retroalimentación del usuario.
 * Cerveza: 1 barril (10L) cada 5 personas = 2 L/persona.
 * Fernet/Gin: 1 barril (10L) cada 8 personas = 1.25 L/persona.
 */
export const LITERS_PER_PERSON: { [key in Drink]: number } = {
  [Drink.BEER]: 2,
  [Drink.FERNET]: 1.25,
  [Drink.GIN]: 1.25,
};

export const WINTER_CONSUMPTION_MULTIPLIER = 0.8; // 20% less
export const SAFETY_MARGIN = 1.1; // 10% extra
export const BARREL_CAPACITY = 10; // 10 liters

// --- Form Options ---

export const DRINK_OPTIONS: Drink[] = [Drink.BEER, Drink.FERNET, Drink.GIN];
export const SEASON_OPTIONS: Season[] = [Season.SPRING_SUMMER, Season.AUTUMN_WINTER];
export const DRINK_ICONS: { [key in Drink]: string } = {
    [Drink.BEER]: '🍺',
    [Drink.FERNET]: '🥃',
    [Drink.GIN]: '🍸',
}

// --- Icons ---

export const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);