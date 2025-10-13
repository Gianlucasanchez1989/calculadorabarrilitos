import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Drink, FormData, CalculationResult, DrinkCalculation, ProductPrice } from '../types';
import {
  LITERS_PER_PERSON,
  BARREL_CAPACITY,
  DRINK_OPTIONS,
  UsersIcon,
  DRINK_ICONS,
  MIN_ATTENDEES,
  MAX_ATTENDEES_FOR_CALC,
  PEOPLE_PER_BARREL,
} from '../constants';

interface CalculatorProps {
  onTotalBarrelsChange: (barrels: number) => void;
}

type CalculationMode = 'oneTapPerDrink' | 'kit' | 'barrelOnly';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.794.371c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919 4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059 1.281.073 1.689.073-4.947s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/>
    </svg>
);

const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const calculationModeConfig = {
    barrelOnly: {
        icon: '🛢️',
        title: 'Barril solo',
        text: 'Solo la bebida, sin accesorios.',
        tooltip: 'Incluye un barril listo para servir. No incluye canilla ni balde.',
        dynamicText: 'Estás pidiendo solo los barriles, sin accesorios.',
    },
    kit: {
        icon: '🎁',
        title: 'Kit completo',
        text: 'Todo lo que necesitás para servir y enfriar.',
        tooltip: 'Incluye barril + canilla + balde + regalos.',
        dynamicText: 'Cada kit incluye barril, canilla, balde y regalos.',
    },
    oneTapPerDrink: {
        icon: '🍸',
        title: 'Kit + barriles de recambio',
        text: 'Un solo kit, con barriles extra por bebida.',
        tooltip: 'Cada bebida tiene su propia canilla. Se cambian solo los barriles.',
        dynamicText: 'Un kit principal y barriles adicionales, cada bebida con su propia canilla.',
    }
}

const Calculator: React.FC<CalculatorProps> = ({ onTotalBarrelsChange }) => {
  const [formData, setFormData] = useState<FormData>({
    attendees: MIN_ATTENDEES,
    drinks: [Drink.BEER],
  });
  const [barrelDistribution, setBarrelDistribution] = useState<Record<Drink, number>>({
    [Drink.BEER]: 0,
    [Drink.FERNET]: 0,
    [Drink.GIN]: 0,
  });
  const [attendeesInput, setAttendeesInput] = useState<string>(MIN_ATTENDEES.toString());
  const [attendeesError, setAttendeesError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [prices, setPrices] = useState<Record<string, ProductPrice> | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('kit');
  
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
            const priceData: Record<string, ProductPrice> = {};
            lines.forEach(line => {
                const columns = line.split(',');
                if (columns.length >= 4) {
                    const product = columns[0].trim();
                    const barrelPrice = parseInt(columns[1].trim(), 10) || 0;
                    const kitPrice = parseInt(columns[2].trim(), 10) || 0;
                    const stock = parseInt(columns[3].trim(), 10) || 0;
                    
                    if (product) {
                        priceData[product] = { barrelPrice, kitPrice, stock };
                    }
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
    const { attendees, drinks } = formData;

    if (!attendees || attendees < MIN_ATTENDEES || drinks.length === 0) {
        setShowWarning(false);
        return 0;
    }

    const avgLitersPerPerson = drinks.reduce((sum, d) => sum + LITERS_PER_PERSON[d], 0) / drinks.length;
    const totalLiters = attendees * avgLitersPerPerson;

    const calculatedBarrels = Math.ceil(totalLiters / BARREL_CAPACITY);
    
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

  const showOneTapPerDrinkOption = useMemo(() => {
    // The option is available only if at least one selected drink has more than one barrel.
    return formData.drinks.some(drink => (barrelDistribution[drink] || 0) > 1);
  }, [formData.drinks, barrelDistribution]);
  
  useEffect(() => {
    // If "one tap per drink" is selected but the option is no longer visible,
    // reset to a default valid option ('kit').
    if (!showOneTapPerDrinkOption && calculationMode === 'oneTapPerDrink') {
        setCalculationMode('kit');
    }
  }, [showOneTapPerDrinkOption, calculationMode]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value, 10);
    setFormData(prev => ({ ...prev, attendees: numValue }));
    setAttendeesInput(numValue.toString());
    setAttendeesError(null);
  };

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

    let breakdown: DrinkCalculation[] = [];
    let totalPrice = 0;
    let totalCanillas = 0;
    
    const drinksWithBarrels = formData.drinks.filter(d => (barrelDistribution[d] || 0) > 0);
    const isDiscountApplied = calculationMode === 'kit' || (calculationMode === 'oneTapPerDrink' && drinksWithBarrels.length > 0);


    switch (calculationMode) {
        case 'kit':
            totalCanillas = totalBarrels; // Each kit includes a canilla
            drinksWithBarrels.forEach(drink => {
                const barrels = barrelDistribution[drink] || 0;
                const pricePerKit = prices[drink]?.kitPrice || 0;
                const subtotal = barrels * pricePerKit;
                breakdown.push({
                    drink,
                    barrels,
                    liters: barrels * BARREL_CAPACITY,
                    subtotal,
                    description: 'Kit completo(s)',
                });
                totalPrice += subtotal;
            });
            break;

        case 'barrelOnly':
            totalCanillas = 0;
            drinksWithBarrels.forEach(drink => {
                const barrels = barrelDistribution[drink] || 0;
                const pricePerBarrel = prices[drink]?.barrelPrice || 0;
                const subtotal = barrels * pricePerBarrel;
                breakdown.push({
                    drink,
                    barrels,
                    liters: barrels * BARREL_CAPACITY,
                    subtotal,
                    description: 'Barril(es) solo(s)',
                });
                totalPrice += subtotal;
            });
            break;

        case 'oneTapPerDrink':
        default:
            totalCanillas = drinksWithBarrels.length;
            drinksWithBarrels.forEach(drink => {
                const barrels = barrelDistribution[drink] || 0;
                if (barrels === 0) return;

                const pricePerKit = prices[drink]?.kitPrice || 0;
                const pricePerBarrel = prices[drink]?.barrelPrice || 0;

                const subtotal = (1 * pricePerKit) + (Math.max(0, barrels - 1) * pricePerBarrel);
                
                const description = barrels === 1 ? '1 Kit completo' : `1 Kit + ${barrels - 1} barril(es)`;

                breakdown.push({
                    drink,
                    barrels,
                    liters: barrels * BARREL_CAPACITY,
                    subtotal,
                    description,
                });
                totalPrice += subtotal;
            });
            break;
    }

    const totalLiters = breakdown.reduce((sum, item) => sum + item.liters, 0);

    return {
        breakdown,
        totalLiters,
        totalBarrels,
        totalCanillas,
        totalPrice,
        isDiscountApplied,
    };
  }, [formData.drinks, barrelDistribution, totalBarrels, prices, calculationMode]);

  const needsBiggerChopera = useMemo(() => {
    return Object.values(barrelDistribution).some((barrels: number) => barrels > 3);
  }, [barrelDistribution]);

  const orderText = useMemo(() => {
    if (!calculationResult) return null;
    
    const { breakdown, totalPrice } = calculationResult;
    const productsWithBarrels = breakdown.filter(item => item.barrels > 0);

    const productsText = productsWithBarrels.map(item => item.drink).join(', ');
    const quantityTextParts = productsWithBarrels.map(item => `${item.barrels}x ${item.drink} (${item.description})`);
    
    const quantityText = quantityTextParts.join(' + ');
    const priceText = totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0 });

    return [
        "Hola, quiero encargar:",
        `Producto(s): ${productsText}`,
        `Detalle: ${quantityText}`,
        `Total estimado: $${priceText}`,
        "",
        "¡Gracias!"
    ].join('\n');
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-start">
      {/* Form Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-slate-700 space-y-6">
        <h2 className="text-2xl font-bold text-slate-100">Armá tu calculo</h2>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <label htmlFor="attendees-input" className="text-sm font-medium text-slate-300">Cantidad de personas</label>
                    <div className="relative w-28">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <UsersIcon />
                        </span>
                        <input
                            type="number"
                            id="attendees-input"
                            value={attendeesInput}
                            onChange={handleAttendeesChange}
                            onBlur={handleAttendeesBlur}
                            onFocus={(e) => e.target.select()}
                            className={`w-full pl-10 pr-2 py-2 text-center bg-slate-700 border rounded-md shadow-sm transition ${attendeesError ? 'border-red-500 text-red-400 focus:ring-red-500 focus:border-red-500' : 'border-slate-600 focus:ring-emerald-500 focus:border-emerald-500'}`}
                            aria-invalid={!!attendeesError}
                            aria-describedby="attendees-error"
                            min={MIN_ATTENDEES}
                        />
                    </div>
                </div>
                <div className="pt-1">
                    <input
                        type="range"
                        min={MIN_ATTENDEES}
                        max={MAX_ATTENDEES_FOR_CALC}
                        step="5"
                        value={formData.attendees}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>{MIN_ATTENDEES}</span>
                        <span>{MAX_ATTENDEES_FOR_CALC}</span>
                    </div>
                </div>
                {attendeesError && (
                    <p id="attendees-error" className="text-xs text-red-400 mt-1" role="alert">
                        {attendeesError}
                    </p>
                )}
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

                                {calculationResult && calculationResult.breakdown.some(item => item.barrels > 0) && (
                                    <div className="text-center bg-black/20 p-3 rounded-lg text-sm text-slate-300">
                                        <p>
                                            {(() => {
                                                const drinksWithBarrels = calculationResult.breakdown.filter(item => item.barrels > 0);
                                                if (drinksWithBarrels.length === 0) return null;

                                                let totalMinPeople = 0;
                                                let totalMaxPeople = 0;
                                                
                                                drinksWithBarrels.forEach(item => {
                                                    const range = PEOPLE_PER_BARREL[item.drink];
                                                    totalMinPeople += item.barrels * range.min;
                                                    totalMaxPeople += item.barrels * range.max;
                                                });

                                                if (calculationResult.totalBarrels === 1) {
                                                    return (
                                                        <>
                                                            Con 1 barril, disfrutan entre <strong>{totalMinPeople}</strong> y <strong>{totalMaxPeople}</strong> personas, según el consumo del grupo.
                                                        </>
                                                    );
                                                }

                                                return (
                                                    <>
                                                        Con {calculationResult.totalBarrels} barriles, disfrutan entre <strong>{totalMinPeople}</strong> y <strong>{totalMaxPeople}</strong> personas, según el consumo del grupo.
                                                    </>
                                                );
                                            })()}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-black/20 p-4 rounded-lg space-y-3">
                                    <h3 className="text-lg font-semibold text-center text-emerald-200 mb-3">¡Arma tu pedido! Elegí cómo querés tu bebida.</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {(['barrelOnly', 'kit', 'oneTapPerDrink'] as CalculationMode[]).map(mode => {
                                            if (mode === 'oneTapPerDrink' && !showOneTapPerDrinkOption) return null;
                                            
                                            const config = calculationModeConfig[mode];
                                            const isSelected = calculationMode === mode;

                                            return (
                                                <div key={mode} className="relative group">
                                                    <button 
                                                        onClick={() => setCalculationMode(mode)}
                                                        className={`w-full h-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex flex-col ${isSelected ? 'bg-sky-500 border-sky-300' : 'bg-black/20 border-sky-800 hover:border-sky-600 hover:bg-black/30'}`}
                                                    >
                                                        <span className="text-lg">{config.icon}</span>
                                                        <span className="font-bold text-sm mt-1">{config.title}</span>
                                                        <span className="text-xs text-slate-300 mt-1">{config.text}</span>
                                                    </button>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-center text-white bg-slate-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                                        {config.tooltip}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                <div className="bg-black/20 p-4 rounded-lg space-y-3">
                                    <div className="text-center pb-2 border-b border-white/10">
                                        <p className="text-sm font-semibold text-emerald-200">Tu selección:</p>
                                        <p className="text-xs text-slate-200">{calculationModeConfig[calculationMode].dynamicText}</p>
                                    </div>
                                    <h3 className="text-lg font-semibold text-center text-emerald-200">Resumen del pedido</h3>
                                    {calculationResult.breakdown.filter(({ barrels }) => barrels > 0).map(({ drink, barrels, subtotal, description }) => (
                                        <div key={drink} className="border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-slate-100">{DRINK_ICONS[drink]} {drink} ({barrels}x)</span>
                                                <span className="font-bold text-lg text-white">
                                                    {subtotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-sky-200 pl-7">{description}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                {calculationResult.isDiscountApplied && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-200 bg-black/20 p-3 rounded-lg">
                                        <StarIcon />
                                        <span className="font-semibold">¡Descuento por kit completo aplicado!</span>
                                    </div>
                                )}

                                <div className="text-center bg-black/30 p-4 rounded-lg">
                                    <p className="text-lg text-sky-100">Precio total estimado:</p>
                                    <p className="text-4xl font-extrabold tracking-tighter my-1">
                                        {calculationResult.totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 })}
                                    </p>
                                </div>

                                {needsBiggerChopera && (
                                     <div className="mt-4 bg-amber-800/60 border border-amber-600 text-amber-100 text-sm rounded-lg p-4 text-center">
                                        <p>
                                            ⚠️ Para más de 30L de una misma bebida te conviene una chopera más grande.{' '}
                                            <a
                                                href="https://wa.me/5493425521278?text=Hola%20👋%2C%20quiero%20consultar%20por%20mi%20pedido%20de%20barriles%20y%20chopera."
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-white underline hover:text-amber-200 transition-colors"
                                            >
                                                Consultanos 👉
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-slate-100 flex items-center justify-center flex-col min-h-[250px]">
                                {isLoadingPrices ? <p>Cargando precios actualizados...</p> : <p>Completa los datos para ver la estimación.</p>}
                            </div>
                        )}
                    </div>
                    <div>
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