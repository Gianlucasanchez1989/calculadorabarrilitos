import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Drink, FormData, CalculationResult, Season, DrinkCalculation } from '../types';
import {
  LITERS_PER_PERSON,
  SAFETY_MARGIN,
  BARREL_CAPACITY,
  DRINK_OPTIONS,
  SEASON_OPTIONS,
  WINTER_CONSUMPTION_MULTIPLIER,
  UsersIcon,
  DRINK_ICONS,
} from '../constants';

const Calculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    attendees: 50,
    drinks: [Drink.BEER, Drink.FERNET],
    season: Season.SPRING_SUMMER,
  });
  const [barrelDistribution, setBarrelDistribution] = useState<Record<Drink, number>>({
    [Drink.BEER]: 0,
    [Drink.FERNET]: 0,
    [Drink.GIN]: 0,
  });
  const [showWarning, setShowWarning] = useState(false);

  const totalBarrels = useMemo(() => {
    const { attendees, drinks, season } = formData;
    setShowWarning(false); // Reset warning on each calculation

    if (!attendees || attendees <= 0 || drinks.length === 0) return 0;

    const avgLitersPerPerson = drinks.reduce((sum, d) => sum + LITERS_PER_PERSON[d], 0) / drinks.length;
    let totalLiters = attendees * avgLitersPerPerson;

    if (season === Season.AUTUMN_WINTER) {
      totalLiters *= WINTER_CONSUMPTION_MULTIPLIER;
    }

    const finalLitersWithMargin = totalLiters * SAFETY_MARGIN;
    const calculatedBarrels = Math.ceil(finalLitersWithMargin / BARREL_CAPACITY);
    
    const minBarrels = drinks.length;

    if (calculatedBarrels > 0 && calculatedBarrels < minBarrels) {
        setShowWarning(true);
    }

    return Math.max(calculatedBarrels, minBarrels);
  }, [formData]);

  const distributeBarrelsEqually = useCallback((drinks: Drink[], total: number) => {
    const newDistribution: Record<Drink, number> = {
      [Drink.BEER]: 0,
      [Drink.FERNET]: 0,
      [Drink.GIN]: 0,
    };
    if (drinks.length > 0) {
      const barrelsPerDrink = Math.floor(total / drinks.length);
      const remainder = total % drinks.length;
      drinks.forEach((drink, index) => {
        newDistribution[drink] = barrelsPerDrink + (index < remainder ? 1 : 0);
      });
    }
    setBarrelDistribution(newDistribution);
  }, []);

  useEffect(() => {
    distributeBarrelsEqually(formData.drinks, totalBarrels);
  }, [formData.drinks, totalBarrels, distributeBarrelsEqually]);

  const handleDrinkChange = (drink: Drink) => {
    setFormData((prev) => {
      const newDrinks = prev.drinks.includes(drink)
        ? prev.drinks.filter((d) => d !== drink)
        : [...prev.drinks, drink];
      if (newDrinks.length === 0) {
        return { ...prev, drinks: prev.drinks }; // Prevent removing the last drink
      }
      return { ...prev, drinks: newDrinks.sort() };
    });
  };

  const handleBarrelChange = (changedDrink: Drink, newBarrelValue: number) => {
    const newDistribution: Record<Drink, number> = { ...barrelDistribution };
    const cappedValue = Math.max(0, Math.min(newBarrelValue, totalBarrels));
    newDistribution[changedDrink] = cappedValue;

    const remainingBarrels = totalBarrels - cappedValue;
    const otherDrinks = formData.drinks.filter(d => d !== changedDrink);
    
    if (otherDrinks.length > 0) {
        const barrelsPerOtherDrink = Math.floor(remainingBarrels / otherDrinks.length);
        const remainder = remainingBarrels % otherDrinks.length;

        otherDrinks.forEach((drink, index) => {
            newDistribution[drink] = barrelsPerOtherDrink + (index < remainder ? 1 : 0);
        });
    } else if (cappedValue < totalBarrels) {
        newDistribution[changedDrink] = totalBarrels;
    }
    
    const currentSum = Object.values(newDistribution).reduce((a, b) => a + b, 0);
    if(currentSum !== totalBarrels && formData.drinks.length > 0){
        const diff = totalBarrels - currentSum;
        const firstDrink = formData.drinks.find(d => newDistribution[d] !== undefined) || formData.drinks[0];
        if(firstDrink) {
          newDistribution[firstDrink] += diff;
        }
    }

    setBarrelDistribution(newDistribution);
  };
  
  const calculationResult: CalculationResult | null = useMemo(() => {
    if (totalBarrels <= 0) return null;

    const breakdown: DrinkCalculation[] = formData.drinks.map(drink => ({
        drink,
        barrels: barrelDistribution[drink] || 0,
        liters: (barrelDistribution[drink] || 0) * BARREL_CAPACITY,
    }));
    
    const totalLiters = breakdown.reduce((sum, item) => sum + item.liters, 0);

    return {
      breakdown,
      totalLiters,
      totalBarrels,
    };
  }, [formData.drinks, barrelDistribution, totalBarrels]);

  const InputField = ({ id, label, value, onChange, icon, min = 1, max=1000 }: { id: string, label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, min?: number, max?:number }) => (
    <div className="flex flex-col space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-300">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </span>
            <input
                type="number"
                id={id}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
        </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700 space-y-6">
        <h2 className="text-2xl font-bold text-slate-100">Detalles del evento</h2>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <InputField 
                id="attendees"
                label="Cantidad de asistentes"
                value={formData.attendees}
                onChange={e => setFormData({ ...formData, attendees: parseInt(e.target.value, 10) || 0 })}
                icon={<UsersIcon />}
            />

            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-slate-300">Época del año</label>
                <div className="grid grid-cols-2 gap-2">
                    {SEASON_OPTIONS.map(season => (
                        <button
                            key={season}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, season }))}
                            className={`px-4 py-2 text-sm rounded-md transition duration-200 ${formData.season === season ? 'bg-sky-500 text-white font-semibold shadow-lg' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {season}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <label className="text-sm font-medium text-slate-300">Tipo de bebida</label>
                 <div className="grid grid-cols-3 gap-2">
                    {DRINK_OPTIONS.map(drink => (
                        <button
                            key={drink}
                            type="button"
                            onClick={() => handleDrinkChange(drink)}
                            className={`px-4 py-2 text-sm rounded-md transition duration-200 flex items-center justify-center gap-2 ${formData.drinks.includes(drink) ? 'bg-sky-500 text-white font-semibold shadow-lg' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {DRINK_ICONS[drink]} {drink}
                        </button>
                    ))}
                </div>
            </div>

            {formData.drinks.length > 1 && totalBarrels > 0 && (
                 <div className="bg-slate-900/50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                         <p className="text-sm font-medium text-slate-300">Distribución de barriles</p>
                         <button type="button" onClick={() => distributeBarrelsEqually(formData.drinks, totalBarrels)} className="text-xs bg-emerald-500 text-white font-semibold rounded-md px-3 py-1 hover:bg-emerald-600 transition">Distribuir equitativamente</button>
                    </div>
                    <div className="space-y-4 pt-2">
                        {formData.drinks.map(drink => (
                            <div key={drink} className="flex items-center gap-4">
                                <span className="text-2xl">{DRINK_ICONS[drink]}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-300">{drink}</span>
                                        <span className="font-bold text-emerald-400">{barrelDistribution[drink] || 0} barriles</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={totalBarrels}
                                        step="1"
                                        value={barrelDistribution[drink] || 0}
                                        onChange={(e) => handleBarrelChange(drink, parseInt(e.target.value, 10))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </form>
      </div>

      {/* Results Section */}
       <div className="bg-gradient-to-br from-emerald-500 to-sky-600 p-6 rounded-2xl shadow-2xl flex flex-col justify-between text-white">
            <div>
                <h2 className="text-2xl font-bold text-center mb-4">Resultado de la estimación</h2>
                {calculationResult ? (
                    <div className="space-y-4">
                        <div className="bg-black/20 p-4 rounded-lg space-y-3">
                             <h3 className="text-lg font-semibold text-center text-emerald-200 mb-2">Desglose por bebida</h3>
                            {calculationResult.breakdown.map(({ drink, barrels }) => (
                                <div key={drink} className="flex justify-between items-baseline">
                                    <span className="font-medium text-slate-100">{DRINK_ICONS[drink]} {drink}:</span>
                                    <span className="text-right">
                                        <strong className="text-xl font-bold">{barrels}</strong> barriles
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center bg-black/30 p-4 rounded-lg">
                            <p className="text-lg text-sky-100">Total estimado</p>
                            <p className="text-6xl font-extrabold tracking-tighter my-1">{calculationResult.totalBarrels}</p>
                            <p className="text-xl font-bold text-sky-100">barriles de 10 L</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-100 h-full flex items-center justify-center flex-col min-h-[250px]">
                        <p>Completa los datos para ver la estimación.</p>
                    </div>
                )}
                {showWarning && calculationResult && (
                    <div className="mt-4 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 text-amber-200 px-4 py-3 rounded-xl text-sm text-center">
                        <p><strong>⚠️ Atención:</strong> Con esta cantidad de asistentes, un barril por bebida es demasiado. ¡Podrías reducir un poco y ahorrar para la próxima!</p>
                    </div>
                )}
            </div>
            <div className="text-xs text-center bg-black/20 p-3 rounded-lg text-emerald-100 mt-6">
                <p className="font-semibold">Aclaración necesaria:</p>
                <p>Este cálculo contempla un margen de seguridad del 10%. Los valores son estimativos y pueden variar según el consumo real de cada persona</p>
            </div>
      </div>
    </div>
  );
};

export default Calculator;