import React from 'react';

interface ImpactCardProps {
  title: string;
  value: string;
  colorClasses: string;
  description: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ title, value, colorClasses, description }) => (
    <div className={`p-6 rounded-2xl shadow-2xl text-center border ${colorClasses}`}>
        <p className="font-bold text-lg">{title}</p>
        <p className="text-5xl font-extrabold my-2 text-white">{value}</p>
        <p className="text-sm opacity-80">{description}</p>
    </div>
);

interface EnvironmentalImpactProps {
  totalBarrels: number;
}

const IMPACT_RATES = {
    barrel: 1.2,
    can: 2.5,
    glass: 3.5,
};

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({ totalBarrels }) => {
    const isCalculated = totalBarrels > 0;

    const barrelValue = isCalculated ? (IMPACT_RATES.barrel * totalBarrels).toFixed(1) : IMPACT_RATES.barrel.toString();
    const canValue = isCalculated ? (IMPACT_RATES.can * totalBarrels).toFixed(1) : IMPACT_RATES.can.toString();
    const glassValue = isCalculated ? (IMPACT_RATES.glass * totalBarrels).toFixed(1) : IMPACT_RATES.glass.toString();
    
    const description = isCalculated ? "kg CO₂ en total" : "kg CO₂ / 10 L";

    return (
        <section className="mt-16 text-slate-300">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500 mb-8">
                El Planeta te lo agradece
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImpactCard 
                    title="Barril" 
                    value={barrelValue} 
                    description={description}
                    colorClasses="bg-emerald-500/10 border-emerald-500 text-emerald-400"
                />
                 <ImpactCard 
                    title="Lata" 
                    value={canValue} 
                    description={description}
                    colorClasses="bg-yellow-500/10 border-yellow-500 text-yellow-400"
                />
                 <ImpactCard 
                    title="Vidrio" 
                    value={glassValue} 
                    description={description}
                    colorClasses="bg-red-500/10 border-red-500 text-red-400"
                />
            </div>
            <p className="text-center text-slate-400 mt-8 max-w-3xl mx-auto">
                La huella de CO₂ es la cantidad de gases que se generan al producir y transportar tu bebida. Elegir barriles reduce hasta un 60% el impacto en comparación con latas o vidrio. 🌍💚
            </p>
        </section>
    );
};

export default EnvironmentalImpact;