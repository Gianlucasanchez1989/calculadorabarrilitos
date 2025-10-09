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
  MIN_ATTENDEES,
  MAX_ATTENDEES_FOR_CALC,
} from '../constants';

interface CalculatorProps {
  onTotalBarrelsChange: (barrels: number) => void;
}

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.794.371c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919 4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/>
    </svg>
);

const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
);


const Calculator: React.FC<CalculatorProps> = ({ onTotalBarrelsChange }) => {
  const [formData, setFormData] = useState<FormData>({
    attendees: MIN_ATTENDEES,
    drinks: [Drink.BEER],
    season: Season.SPRING_SUMMER,
  });
  const [barrelDistribution, setBarrelDistribution] = useState<Record<Drink, number>>({
    [Drink.BEER]: 0,
    [Drink.FERNET]: 0,
    [Drink.GIN]: 0,
  });
  const [attendeesInput, setAttendeesInput] = useState<string>(MIN_ATTENDEES.toString());
  const [attendeesError, setAttendeesError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [prices, setPrices] = useState<Record<string, number> | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false);
  
  const isEventTooLarge = formData.attendees > MAX_ATTENDEES_FOR_CALC;

  useEffect(() => {
    const fetchPrices = async () => {
        try {
            const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRzBXKoYgw1cRrhr4VTIQLEfQ30NrCGlmDIgacvLoUYN_eTnnZ7qMvdxVMNhqHIrg6cwchewxYUesv_/pub?gid=0&single=true&output=csv');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const csvText = await response.text();
            const lines = csvText.trim().split('\n').slice(1); // Skip header
            const priceData: Record<string, number> = {};
            lines.forEach(line => {
                const [product, price] = line.split(',');
                if (product && price) {
                    priceData[product.trim()] = parseInt(price.trim(), 10);
                }
            });
            setPrices(priceData);
        } catch (error) {
            console.error("Failed to fetch prices:", error);
            // Optionally, set an error state to show a message to the user
        } finally {
            setIsLoadingPrices(false);
        }
    };

    fetchPrices();
  }, []);

  const totalBarrels = useMemo(() => {
    const { attendees, drinks, season } = formData;

    if (!attendees || attendees < MIN_ATTENDEES || drinks.length === 0) {
        setShowWarning(false);
        return 0;
    }

    const avgLitersPerPerson = drinks.reduce((sum, d) => sum + LITERS_PER_PERSON[d], 0) / drinks.length;
    let totalLiters = attendees * avgLitersPerPerson;

    if (season === Season.AUTUMN_WINTER) {
      totalLiters *= WINTER_CONSUMPTION_MULTIPLIER;
    }

    const finalLitersWithMargin = totalLiters * SAFETY_MARGIN;
    const calculatedBarrels = Math.ceil(finalLitersWithMargin / BARREL_CAPACITY);
    
    const minRequiredBarrels = drinks.length;
    if (calculatedBarrels > 0 && calculatedBarrels < minRequiredBarrels) {
        setShowWarning(true);
        return minRequiredBarrels;
    }

    setShowWarning(false);
    return calculatedBarrels;
  }, [formData]);
  
  useEffect(() => {
    onTotalBarrelsChange(totalBarrels);
  }, [totalBarrels, onTotalBarrelsChange]);

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

  const handleAttendeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAttendeesInput(value);

    if (value === '') {
        setAttendeesError(null);
        setFormData(prev => ({ ...prev, attendees: 0 }));
        return;
    }

    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue)) {
        if (numValue > 0 && numValue < MIN_ATTENDEES) {
             setAttendeesError(`El mínimo es de ${MIN_ATTENDEES} asistentes.`);
        } else {
             setAttendeesError(null);
        }
        setFormData(prev => ({ ...prev, attendees: numValue }));
    } else {
        setFormData(prev => ({ ...prev, attendees: 0 }));
    }
  };
  
  const handleAttendeesBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const numValue = parseInt(e.target.value, 10);
      if (isNaN(numValue) || numValue < MIN_ATTENDEES) {
          setAttendeesInput(MIN_ATTENDEES.toString());
          setFormData(prev => ({ ...prev, attendees: MIN_ATTENDEES }));
          setAttendeesError(null);
      }
  };

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
    if (totalBarrels <= 0 || !prices) return null;

    const breakdown: DrinkCalculation[] = formData.drinks.map(drink => ({
        drink,
        barrels: barrelDistribution[drink] || 0,
        liters: (barrelDistribution[drink] || 0) * BARREL_CAPACITY,
    }));
    
    const totalLiters = breakdown.reduce((sum, item) => sum + item.liters, 0);
    const totalPrice = breakdown.reduce((sum, { drink, barrels }) => {
        const pricePerBarrel = prices[drink] || 0;
        return sum + (barrels * pricePerBarrel);
    }, 0);

    return {
      breakdown,
      totalLiters,
      totalBarrels,
      totalPrice,
    };
  }, [formData.drinks, barrelDistribution, totalBarrels, prices]);

  const orderText = useMemo(() => {
    if (!calculationResult || calculationResult.totalBarrels <= 0) {
        return null;
    }

    const { breakdown, totalPrice } = calculationResult;
    const productsWithBarrels = breakdown.filter(item => item.barrels > 0);
    
    const productsText = productsWithBarrels
        .map(item => item.drink)
        .join(', ');

    const quantityText = productsWithBarrels
        .map(item => `${item.barrels} ${item.barrels === 1 ? 'barril' : 'barriles'} de ${item.drink}`)
        .join(', ');

    const priceText = totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0 });

    const textParts = [
        "Hola, quiero encargar:",
        `Producto: ${productsText}`,
        `Cantidad: ${quantityText}`,
        `Total estimado: $${priceText}`,
        "",
        "¡Gracias!"
    ];

    return textParts.join('\n');
  }, [calculationResult]);

  const whatsappLink = useMemo(() => {
    const baseUrl = "https://wa.me/5493425521278";
    if (!orderText) {
        return baseUrl;
    }
    return `${baseUrl}?text=${encodeURIComponent(orderText)}`;
  }, [orderText]);

  const handleCopyClick = () => {
    if (!orderText || isCopied) return;

    navigator.clipboard.writeText(orderText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
  };

  const clarificationText = useMemo(() => {
    if (!calculationResult || calculationResult.totalBarrels <= 0) {
      return null;
    }
    const { totalBarrels } = calculationResult;
    const isSingular = totalBarrels === 1;
    
    const kits = isSingular ? 'kit' : 'kits';
    const completos = isSingular ? 'completo' : 'completos';
    const barriles = isSingular ? 'barril' : 'barriles';
    const canillas = isSingular ? 'canilla' : 'canillas';
    const colders = isSingular ? 'colder' : 'colders';

    return `El precio mostrado corresponde a ${totalBarrels} ${kits} ${completos}: ${barriles}, ${canillas}, ${colders} + regalos. Podés ajustar los kits como quieras, escribinos.`;
  }, [calculationResult]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-start">
      {/* Form Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700 space-y-6">
        <h2 className="text-2xl font-bold text-slate-100">Armá tu calculo</h2>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col space-y-2">
                <label htmlFor="attendees" className="text-sm font-medium text-slate-300">Cantidad de personas</label>
                <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UsersIcon />
                    </span>
                    <input
                        type="number"
                        id="attendees"
                        value={attendeesInput}
                        onChange={handleAttendeesChange}
                        onBlur={handleAttendeesBlur}
                        onFocus={(e) => e.target.select()}
                        className={`w-full pl-10 pr-4 py-2 bg-slate-700 border rounded-md shadow-sm transition ${attendeesError ? 'border-red-500 text-red-400 focus:ring-red-500 focus:border-red-500' : 'border-slate-600 focus:ring-emerald-500 focus:border-emerald-500'}`}
                        aria-invalid={!!attendeesError}
                        aria-describedby="attendees-error"
                    />
                </div>
                 {attendeesError && (
                    <p id="attendees-error" className="text-xs text-red-400" role="alert">
                        {attendeesError}
                    </p>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-slate-300">Época del año</label>
                <p className="text-xs text-slate-400">El consumo varía en función de la temporada.</p>
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

            {formData.drinks.length > 1 && totalBarrels > 0 && !isEventTooLarge && (
                 <div className="bg-slate-900/50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                         <p className="text-sm font-medium text-slate-300">Distribución de barriles</p>
                         <button type="button" onClick={() => distributeBarrelsEqually(formData.drinks, totalBarrels)} className="text-xs bg-emerald-500 text-white font-semibold rounded-md px-3 py-1 hover:bg-emerald-600 transition">Repartir parejo</button>
                    </div>
                     {showWarning && (
                        <div className="bg-amber-900/50 border border-amber-700 text-amber-200 text-xs rounded-md p-3">
                            <p>⚠️ Atención: Con esta cantidad de asistentes, un barril por bebida es demasiado. ¡Podrías reducir un poco y ahorrar para la próxima!</p>
                        </div>
                    )}
                    <div className="space-y-4 pt-2">
                        {formData.drinks
                            .filter(drink => (barrelDistribution[drink] || 0) > 0)
                            .map(drink => (
                            <div key={drink} className="flex items-center gap-4">
                                <span className="text-2xl">{DRINK_ICONS[drink]}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-300">{drink}</span>
                                        <span className="font-bold text-emerald-400">{barrelDistribution[drink] || 0} {(barrelDistribution[drink] || 0) === 1 ? 'barril' : 'barriles'}</span>
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
            {isEventTooLarge ? (
                <div className="text-center my-auto">
                    <p className="text-2xl mb-4">🚨 Tu evento es grande 🚀</p>
                    <p className="text-slate-100">Te recomendamos consultar con Pump Barrilito para asesorarte sobre promociones y barriles de mayor capacidad.</p>
                </div>
            ) : (
                <>
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-4">Resultado de la estimación</h2>
                        {calculationResult ? (
                            <div className="space-y-4">
                                <div className="text-center bg-black/30 p-4 rounded-lg">
                                    <p className="text-lg text-sky-100">Vas a necesitar aproximadamente:</p>
                                    <p className="text-6xl font-extrabold tracking-tighter my-1">{calculationResult.totalBarrels}</p>
                                    <p className="text-xl font-bold text-sky-100">{calculationResult.totalBarrels === 1 ? 'Barril' : 'Barriles'} de 10 L</p>
                                </div>
                                <div className="text-center bg-black/30 p-4 rounded-lg">
                                    <p className="text-lg text-sky-100">Precio total estimado:</p>
                                    <p className="text-4xl font-extrabold tracking-tighter my-1">
                                        {calculationResult.totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg space-y-3">
                                    <h3 className="text-lg font-semibold text-center text-emerald-200 mb-2">Desglose por bebida</h3>
                                    {calculationResult.breakdown.filter(({ barrels }) => barrels > 0).map(({ drink, barrels }) => (
                                        <div key={drink} className="flex justify-between items-baseline">
                                            <span className="font-medium text-slate-100">{DRINK_ICONS[drink]} {drink}:</span>
                                            <span className="text-right">
                                                <strong className="text-xl font-bold">{barrels}</strong> {barrels === 1 ? 'barril' : 'barriles'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-100 flex items-center justify-center flex-col min-h-[250px]">
                                {isLoadingPrices ? <p>Cargando precios actualizados...</p> : <p>Completa los datos para ver la estimación.</p>}
                            </div>
                        )}
                    </div>
                    <div>
                        {clarificationText && (
                            <div className="text-xs text-center bg-black/20 p-3 rounded-lg text-emerald-100 mt-6">
                                <p className="font-semibold">Aclaración:</p>
                                <p>{clarificationText}</p>
                            </div>
                        )}
                        <div className="mt-6 flex flex-col gap-4">
                             <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg"
                            >
                                <WhatsAppIcon />
                                <span>Pedir por WhatsApp</span>
                            </a>
                            <a
                                href="https://www.instagram.com/pumpbarrilito/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-opacity duration-300 shadow-lg"
                            >
                                <InstagramIcon />
                                <span>Pedir por Instagram</span>
                            </a>
                             <button
                                onClick={handleCopyClick}
                                disabled={!orderText || isCopied}
                                className="flex items-center justify-center gap-3 w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                            >
                                <ClipboardIcon />
                                <span>{isCopied ? 'Pedido copiado ✅' : 'Copiar pedido'}</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
      </div>
    </div>
  );
};

export default Calculator;