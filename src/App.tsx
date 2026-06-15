/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import {
  Coins,
  TrendingUp,
  AlertCircle,
  Sliders,
  Settings2,
  Calendar,
  CheckCircle2,
  Building2,
  User,
  HelpCircle,
  Sparkles,
  Info,
  Check,
  X,
  FileText,
  Briefcase,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  DEFAULT_SETTINGS,
  ARL_LEVELS,
  compareSalaries,
} from "./calculator";
import { CalculatorSettings } from "./types";

// Currency Formatter Utility for COP
const formatCOP = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function App() {
  // Input states
  const [indefiniteGross, setIndefiniteGross] = useState<number>(3000000);
  const [servicesGross, setServicesGross] = useState<number>(3000000);
  const [arlLevel, setArlLevel] = useState<number>(1);
  const [unpaidRestDays, setUnpaidRestDays] = useState<number>(15);
  
  // Settings & Advanced states
  const [settings, setSettings] = useState<CalculatorSettings>(DEFAULT_SETTINGS);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"summary" | "detailed" | "proscons">("summary");

  // Calculate comparisons dynamically
  const comparison = useMemo(() => {
    return compareSalaries(
      indefiniteGross,
      servicesGross,
      arlLevel,
      unpaidRestDays,
      settings
    );
  }, [indefiniteGross, servicesGross, arlLevel, unpaidRestDays, settings]);

  // Adjust settings values safely
  const handleSettingChange = (key: keyof CalculatorSettings, val: number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Preset Salaries (COP Millions)
  const salaryPresets = [1500000, 3000000, 5000000, 8000000, 12000000, 16000000];

  // Helper to sync services salary to the Golden Rule
  const applyGoldenRule = () => {
    setServicesGross(Math.round(comparison.goldenRuleFee));
  };

  // Calculate percentage of difference
  const netMonthlyDiff = comparison.services.netMonthly - comparison.indefinite.netMonthly;
  const netMonthlyDiffPercent = (netMonthlyDiff / comparison.indefinite.netMonthly) * 100;
  
  const annualNetDiff = comparison.services.totalAnnualNet - comparison.indefinite.totalAnnualNet;
  const annualNetDiffPercent = (annualNetDiff / comparison.indefinite.totalAnnualNet) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-teal-500/20 Selection:text-teal-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section (Aesthetic design, clear hierarchy) */}
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5" />
            Simulador Laboral Colombia
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contrato Indefinido <span className="text-teal-600">vs.</span> Prestación de Servicios
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            El mito del salario bruto: analiza retenciones, prestaciones de ley, salud, pensión, ARL y vacaciones para conocer tu ingreso neto mensual y anual real.
          </p>
        </header>

        {/* Dashboard Layout: Left Controls, Right Outcomes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Interactive inputs with premium sliders (Cols: 5) */}
          <section className="lg:col-span-5 space-y-6">
            
            {/* Input card for Indefinite Salary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Contrato Indefinido</h2>
                    <p className="text-xs text-slate-400">Salario laboral ordinario</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full uppercase font-semibold">
                    Laboral
                  </span>
                </div>
              </div>

              {/* Value Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                  Salario Bruto Mensual
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={indefiniteGross}
                    onChange={(e) => {
                      const value = Math.max(0, parseInt(e.target.value) || 0);
                      setIndefiniteGross(value);
                    }}
                    className="w-full pl-8 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-semibold"
                    placeholder="Escribe el salario bruto..."
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                    COP
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="1430000"
                  max="20000000"
                  step="50000"
                  value={indefiniteGross}
                  onChange={(e) => setIndefiniteGross(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-md appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$1.4M (1 SMLMV)</span>
                  <span>$20M</span>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Valores de referencia rápidos:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {salaryPresets.slice(0, 3).map((val) => (
                    <button
                      key={`indef-${val}`}
                      onClick={() => setIndefiniteGross(val)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-colors font-medium font-mono ${
                        indefiniteGross === val
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {val >= 1000000 ? `${val / 1000000}M` : formatCOP(val)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input card for Prestación de Servicios */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Prestación de Servicios</h2>
                    <p className="text-xs text-slate-400">Contratista independiente</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full uppercase font-semibold">
                    Por Honorarios
                  </span>
                </div>
              </div>

              {/* Value Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                  Honorarios Mensuales Pactados
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium font-mono">
                    $
                  </span>
                  <input
                    type="number"
                    value={servicesGross}
                    onChange={(e) => {
                      const value = Math.max(0, parseInt(e.target.value) || 0);
                      setServicesGross(value);
                    }}
                    className="w-full pl-8 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-semibold"
                    placeholder="Escribe tus honorarios..."
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                    COP
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="1430000"
                  max="20000000"
                  step="50000"
                  value={servicesGross}
                  onChange={(e) => setServicesGross(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-md appearance-none cursor-pointer accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$1.4M</span>
                  <span>$20M</span>
                </div>
              </div>

              {/* Variable sliders específicos: Vacations, ARL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                
                {/* Unpaid Rest/Vacation Days */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Días descanso al año:
                    </span>
                    <span className="text-xs font-bold font-mono text-amber-600">
                      {unpaidRestDays} días
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={unpaidRestDays}
                    onChange={(e) => setUnpaidRestDays(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-md appearance-none cursor-pointer accent-amber-600"
                  />
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Días en que dejas de facturar para descansar (15 es equivalente a empleado).
                  </p>
                </div>

                {/* ARL dropdown */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    Nivel de Riesgo (ARL):
                  </span>
                  <select
                    value={arlLevel}
                    onChange={(e) => setArlLevel(parseInt(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-700 outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  >
                    {ARL_LEVELS.map((arl) => (
                      <option key={arl.level} value={arl.level}>
                        Nivel {arl.level} ({ (arl.rate * 100).toFixed(3) }%)
                      </option>
                    ))}
                  </select>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Fijado por tu profesión. Adm. es Clase I (0.522%).
                  </p>
                </div>
              </div>

              {/* Rule of Gold indicator helper inside services controls */}
              <div className="pt-2">
                <div className="bg-slate-50 border border-dashed border-slate-200 p-3 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Equivalente Real Recomendado:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {formatCOP(comparison.goldenRuleFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">
                      Regla de Oro: (+{(comparison.goldenRuleMarkupPercent).toFixed(1)}%)
                    </span>
                    <button
                      type="button"
                      onClick={applyGoldenRule}
                      className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded-md transition-colors"
                    >
                      Aplicar exacto
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings section */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-slate-600 hover:text-slate-800 text-xs font-bold uppercase tracking-wider"
              >
                <span className="flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-slate-400" />
                  Ajustes Avanzados (Legales)
                </span>
                <span className="text-slate-400 font-mono font-medium text-xs">
                  {showAdvanced ? "Ocultar" : "Mostrar"}
                </span>
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-4 pt-4 mt-2 border-t border-slate-100 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* Salario Minimo setup */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 font-medium">
                          Salario Mínimo (SMLMV):
                        </label>
                        <input
                          type="number"
                          value={settings.minimumWage}
                          onChange={(e) => handleSettingChange("minimumWage", parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono font-medium focus:outline-none"
                        />
                      </div>

                      {/* Aux Transport setup */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 font-medium">
                          Auxilio de Transporte:
                        </label>
                        <input
                          type="number"
                          value={settings.auxTransport}
                          onChange={(e) => handleSettingChange("auxTransport", parseInt(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* IBC percentage standard */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 font-medium">
                          Base de Cotización (IBC %):
                        </label>
                        <select
                          value={settings.ibcPercentage}
                          onChange={(e) => handleSettingChange("ibcPercentage", parseFloat(e.target.value))}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono font-medium focus:outline-none"
                        >
                          <option value={0.4}>40% (Por Ley)</option>
                          <option value={0.6}>60%</option>
                          <option value={1.0}>100%</option>
                        </select>
                      </div>

                      {/* Withholding tax rate */}
                      <div className="space-y-1.5">
                        <label className="text-slate-500 font-medium">
                          Retención en la fuente (%):
                        </label>
                        <select
                          value={settings.retencionFuentePerc}
                          onChange={(e) => handleSettingChange("retencionFuentePerc", parseFloat(e.target.value))}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono font-medium focus:outline-none"
                        >
                          <option value={0.0}>0% (Exento)</option>
                          <option value={0.04}>4% (Estándar)</option>
                          <option value={0.06}>6%</option>
                          <option value={0.10}>10%</option>
                          <option value={0.15}>15%</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 p-2 rounded-md leading-relaxed">
                      💡 <strong>IBC de Ley:</strong> Cotizarás sobre el 40% de tus honorarios, con un límite mínimo de 1 salario mínimo y máximo de 25 salarios mínimos en Colombia.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </section>

          {/* RIGHT PANEL: Calculations & Analytics Display (Cols: 7) */}
          <main className="lg:col-span-7 space-y-6">
            
            {/* Tab navigation (Aesthetic pills) */}
            <div className="flex border border-slate-200 bg-white p-1 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Layers className="w-4 h-4" />
                Resumen de Bolsillo
              </button>
              <button
                onClick={() => setActiveTab("detailed")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "detailed"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4" />
                Desglose Mensual y Anual
              </button>
              <button
                onClick={() => setActiveTab("proscons")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "proscons"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Diferencias Legales
              </button>
            </div>

            {/* TAB CONTENT: Resumen de Bolsillo */}
            {activeTab === "summary" && (
              <div className="space-y-6">
                
                {/* Visual Golden Rule Banner */}
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 translate-x-12 translate-y-6 opacity-10">
                    <TrendingUp className="w-64 h-64" />
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-700/50 border border-emerald-400/30 rounded-full text-[10px] font-bold uppercase tracking-wider text-teal-100">
                      <Sparkles className="w-3 h-3" />
                      Análisis de Equivalencia Real
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black">
                        La Regla de Oro del Contratista
                      </h3>
                      <p className="text-teal-50/90 text-sm leading-relaxed max-w-xl mt-1">
                        Para que un contrato de Prestación de Servicios sea económicamente equivalente a un salario ordinario de <strong className="text-white">{formatCOP(indefiniteGross)}</strong>, deberías cobrar un mínimo de <strong className="text-white font-mono">{formatCOP(comparison.goldenRuleFee)}</strong> por mes.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                      <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-semibold font-mono">
                        Incremento sugerido: +{comparison.goldenRuleMarkupPercent.toFixed(1)}%
                      </div>
                      
                      {Math.abs(servicesGross - comparison.goldenRuleFee) > 100000 && (
                        <button
                          onClick={applyGoldenRule}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-emerald-900 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shadow-xs"
                        >
                          Ajustar honorarios a este valor
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comparative Mini-Metrics Container (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Indefinido Card Summary */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Contrato Indefinido
                      </span>
                      <span className="text-xs font-semibold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {formatCOP(indefiniteGross)} Bruto
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Pago Neto Recibido en Cuenta:</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">
                          {formatCOP(comparison.indefinite.netMonthly)}
                          <span className="text-xs text-slate-400 font-normal ml-1 italic">/mes</span>
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>Salud (4%)</span>
                          <span className="font-mono font-medium text-red-600">-{formatCOP(comparison.indefinite.healthDeduction)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-200/50 pb-1.5">
                          <span>Pensión (4%)</span>
                          <span className="font-mono font-medium text-red-600">-{formatCOP(comparison.indefinite.pensionDeduction)}</span>
                        </div>
                        {comparison.indefinite.auxTransport > 0 && (
                          <div className="flex justify-between items-center text-xs text-slate-500 pt-0.5">
                            <span className="text-emerald-700 font-medium">Auxilio Transporte</span>
                            <span className="font-mono font-semibold text-emerald-600">+{formatCOP(comparison.indefinite.auxTransport)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                          <span className="font-semibold text-indigo-700">Acumulación Extra Promedio (Mensualizado):</span>
                          <span className="font-mono font-bold text-indigo-600">+{formatCOP(comparison.indefinite.totalAnnualBenefitCount / 12)}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                              Ingreso Real Equivalente Anualizado:
                            </span>
                            <span className="text-lg font-black text-slate-800 font-mono">
                              {formatCOP(comparison.indefinite.equivalentMonthlyNet)}
                              <span className="text-xs font-normal text-slate-400 italic">/mes</span>
                            </span>
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal italic">
                          *Contempla los dineros que recibes acumulados al final de cada año (Prima de servicios, Cesantías e Intereses de Cesantías).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prestacion Servicios Card Summary */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Prestación de Servicios
                      </span>
                      <span className="text-xs font-semibold font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        {formatCOP(comparison.services.grossRate)} Bruto
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Remanente Neto de tu Factura:</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">
                          {formatCOP(comparison.services.netMonthly)}
                          <span className="text-xs text-slate-400 font-normal ml-1 italic">/mes</span>
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            Salud независимый (12.5% s. IBC)
                          </span>
                          <span className="font-mono font-medium text-red-600">-{formatCOP(comparison.services.healthPayment)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>Pensión independiente (16% s. IBC)</span>
                          <span className="font-mono font-medium text-red-600">-{formatCOP(comparison.services.pensionPayment)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>ARL (Nivel {comparison.services.arlLevel})</span>
                          <span className="font-mono font-medium text-red-600">-{formatCOP(comparison.services.arlPayment)}</span>
                        </div>
                        {comparison.services.retencionFuenteValue > 0 && (
                          <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200/50 pt-1.5">
                            <span>Retención en Fuente u otros</span>
                            <span className="font-mono font-medium text-red-600">-{formatCOP(comparison.services.retencionFuenteValue)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200/50 pt-1.5">
                          <span className="text-amber-800 font-medium">IBC (Base de cotización):</span>
                          <span className="font-mono font-semibold text-slate-600">{formatCOP(comparison.services.ibc)} (40% Bruto)</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                              Ingreso Real Equivalente Anualizado:
                            </span>
                            <span className="text-lg font-black text-slate-800 font-mono">
                              {formatCOP(comparison.services.equivalentMonthlyNet)}
                              <span className="text-xs font-normal text-slate-400 italic">/mes</span>
                            </span>
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal italic">
                          *Contempla la pérdida de ingresos al no facturar {unpaidRestDays} días de descanso (vacaciones no remuneradas) y pagar salud/pensión mensual.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* VISUAL CUSTOM COMPARSION CHART: Built programmatically as beautifully styled flexbars */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      Visualización de Impacto en tu Bolsillo Real
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Comparativa gráfica de ingresos netos mensuales considerando los aportes y deducciones anualizados.
                    </p>
                  </div>

                  {/* Double custom flex bar comparison of Real Net Monthly Equivalent */}
                  <div className="space-y-5">
                    
                    {/* Bar for Indefinito */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block"></span>
                          Laboral: Contrato Indefinido (Anualizado)
                        </span>
                        <span className="font-black font-mono text-slate-800">
                          {formatCOP(comparison.indefinite.equivalentMonthlyNet)} <span className="text-slate-400 text-[10px] font-normal italic">/mes equivalente</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden relative">
                        {/* 100% represent the maximum of the two */}
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out flex items-center pl-3"
                          style={{
                            width: `${Math.min(100, (comparison.indefinite.equivalentMonthlyNet / Math.max(comparison.indefinite.equivalentMonthlyNet, comparison.services.equivalentMonthlyNet)) * 100)}%`
                          }}
                        >
                          <span className="text-[10px] text-white font-bold whitespace-nowrap">
                            Fondo Bruto: {formatCOP(indefiniteGross)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bar for Services */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                          Independiente: Prestación de Servicios (Anualizado)
                        </span>
                        <span className="font-black font-mono text-slate-800">
                          {formatCOP(comparison.services.equivalentMonthlyNet)} <span className="text-slate-400 text-[10px] font-normal italic">/mes equivalente</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden relative">
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out flex items-center pl-3"
                          style={{
                            width: `${Math.min(100, (comparison.services.equivalentMonthlyNet / Math.max(comparison.indefinite.equivalentMonthlyNet, comparison.services.equivalentMonthlyNet)) * 100)}%`
                          }}
                        >
                          <span className="text-[10px] text-white font-bold whitespace-nowrap">
                            Fondo Bruto: {formatCOP(servicesGross)}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Dynamic comparative insight card depending on state */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3 mt-4 text-xs ${
                    comparison.services.equivalentMonthlyNet > comparison.indefinite.equivalentMonthlyNet 
                      ? "bg-teal-50 border-teal-200 text-teal-800" 
                      : "bg-red-50 border-red-100 text-slate-700"
                  }`}>
                    <div className="mt-0.5">
                      <Info className={`w-4 h-4 ${comparison.services.equivalentMonthlyNet > comparison.indefinite.equivalentMonthlyNet ? "text-teal-600" : "text-red-500"}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">
                        {comparison.services.equivalentMonthlyNet > comparison.indefinite.equivalentMonthlyNet
                          ? "¡La oferta por Prestación de Servicios ofrece un ingreso anual superior!"
                          : "¡Cuidado! El Contrato Indefinido te deja más dinero neto real al final del año."}
                      </p>
                      <p className="leading-relaxed opacity-90">
                        {comparison.services.equivalentMonthlyNet > comparison.indefinite.equivalentMonthlyNet
                          ? `Ganas un aproximado de ${formatCOP(annualNetDiff / 12)} COP extra al mes (+${annualNetDiffPercent.toFixed(1)}%) en comparación con el empleo de nómina, ya descontando tus aportes independientes y reservando tus ${unpaidRestDays} días de descanso.`
                          : `Para quedar económicamente a la par con el contrato indefinido de ${formatCOP(indefiniteGross)}, deberías cobrar al menos ${formatCOP(comparison.goldenRuleFee)} en prestación de servicios. Actualmente estás cobrando ${formatCOP(comparison.services.equivalentMonthlyNet - comparison.indefinite.equivalentMonthlyNet)} COP MENOS al mes en valor equivalente (-${Math.abs(annualNetDiffPercent).toFixed(1)}%).`}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT: Desglose Mensual y Anual */}
            {activeTab === "detailed" && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-wider">
                    Análisis Comparativo Detallado
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Comparación exhaustiva de cada concepto para un entendimiento de todos tus flujos económicos al año.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4 font-semibold text-[10px]">Concepto Económico</th>
                        <th className="py-3 px-4 font-semibold text-[10px] text-indigo-700 bg-indigo-50/50">Contrato Indefinido</th>
                        <th className="py-3 px-4 font-semibold text-[10px] text-amber-700 bg-amber-50/50">Prestación de Servicios</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      
                      {/* INGRESOS MENSUALES */}
                      <tr className="font-bold text-slate-800 bg-slate-50/30">
                        <td className="py-3 px-4">Mensual: Valor Bruto Pactado</td>
                        <td className="py-3 px-4 font-mono text-indigo-600 bg-indigo-50/10">{formatCOP(indefiniteGross)}</td>
                        <td className="py-3 px-4 font-mono text-amber-600 bg-amber-50/10">{formatCOP(servicesGross)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Salud Mensual</td>
                        <td className="py-3 px-4 font-mono text-red-500 bg-indigo-50/10">-{formatCOP(comparison.indefinite.healthDeduction)} <span className="text-[10px] text-slate-400 font-normal">(4%)</span></td>
                        <td className="py-3 px-4 font-mono text-red-500 bg-amber-50/10">-{formatCOP(comparison.services.healthPayment)} <span className="text-[10px] text-slate-400 font-normal">(12.5% de IBC)</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Pensión Mensual</td>
                        <td className="py-3 px-4 font-mono text-red-500 bg-indigo-50/10">-{formatCOP(comparison.indefinite.pensionDeduction)} <span className="text-[10px] text-slate-400 font-normal">(4%)</span></td>
                        <td className="py-3 px-4 font-mono text-red-500 bg-amber-50/10">-{formatCOP(comparison.services.pensionPayment)} <span className="text-[10px] text-slate-400 font-normal">(16% de IBC)</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Riesgos Laborales (ARL)</td>
                        <td className="py-3 px-4 text-slate-400 bg-indigo-50/10">$0 <span className="text-[10px] italic">(Paga empleador)</span></td>
                        <td className="py-3 px-4 font-mono text-red-500 bg-amber-50/10">-{formatCOP(comparison.services.arlPayment)} <span className="text-[10px] text-slate-400 font-normal">({(comparison.services.arlRate * 100).toFixed(3)}%)</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Auxilio de Transporte</td>
                        <td className="py-3 px-4 font-mono text-emerald-600 bg-indigo-50/10">+{formatCOP(comparison.indefinite.auxTransport)}</td>
                        <td className="py-3 px-4 text-slate-400 bg-amber-50/10">$0 <span className="text-[10px] italic">(No aplica)</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Retención en la Fuente / Impuesto</td>
                        <td className="py-3 px-4 text-slate-400 bg-indigo-50/10">$0 <span className="text-[10px] italic">(Bajo retén en fuente)</span></td>
                        <td className="py-3 px-4 font-mono text-red-500 bg-amber-50/10">-{formatCOP(comparison.services.retencionFuenteValue)} <span className="text-[10px] text-slate-400 font-normal">({settings.retencionFuentePerc * 100}%)</span></td>
                      </tr>
                      <tr className="font-bold border-t-2 border-slate-200">
                        <td className="py-3.5 px-4 text-slate-800">Mensual: Neto en tu bolsillo</td>
                        <td className="py-3.5 px-4 font-mono text-base text-indigo-700 bg-indigo-50/30">{formatCOP(comparison.indefinite.netMonthly)}</td>
                        <td className="py-3.5 px-4 font-mono text-base text-amber-700 bg-amber-50/30">{formatCOP(comparison.services.netMonthly)}</td>
                      </tr>

                      {/* EXTRAS ANUALES */}
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-y border-slate-200/50">
                        <td className="py-2.5 px-4 text-[10px]" colSpan={3}>Prestaciones Extras Recibidas al Año (Dineros Adicionales)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Primas de Servicios (Junio + Diciembre)</td>
                        <td className="py-3 px-4 font-mono text-indigo-600 bg-indigo-50/10">+{formatCOP(comparison.indefinite.primaServices)} <span className="text-[10px] text-slate-400 font-normal">(1 sueldo/año)</span></td>
                        <td className="py-3 px-4 text-slate-400 bg-amber-50/10">$0 <span className="text-[10px] italic">(No aplica)</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Cesantías (Consignadas en Fondo)</td>
                        <td className="py-3 px-4 font-mono text-indigo-600 bg-indigo-50/10">+{formatCOP(comparison.indefinite.cesantias)} <span className="text-[10px] text-slate-400 font-normal">(1 sueldo/año)</span></td>
                        <td className="py-3 px-4 text-slate-400 bg-amber-50/10">$0 <span className="text-[10px] italic">(No aplica)</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Intereses de Cesantías (Pago Directo)</td>
                        <td className="py-3 px-4 font-mono text-indigo-600 bg-indigo-50/10">+{formatCOP(comparison.indefinite.interesesCesantias)} <span className="text-[10px] text-slate-400 font-normal">(12% de cesantías)</span></td>
                        <td className="py-3 px-4 text-slate-400 bg-amber-50/10">$0 <span className="text-[10px] italic">(No aplica)</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-500">Vacaciones Remuneradas / Impacto por Rest Days</td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold bg-indigo-50/10">Pago continuado <span className="text-[10px] text-slate-400 font-normal">(15 días hábiles)</span></td>
                        <td className="py-3 px-4 font-mono text-red-500 bg-amber-50/10">-{formatCOP(comparison.services.annualBillingReduction)} <span className="text-[10px] text-slate-400 font-normal">(No biles {unpaidRestDays} días)</span></td>
                      </tr>

                      {/* CONSOLIDADO ANUAL */}
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-y border-slate-200">
                        <td className="py-2.5 px-4 text-[10px]" colSpan={3}>Consolidado Financiero de un Año Completo</td>
                      </tr>
                      <tr className="font-extrabold border-t-2 border-slate-200">
                        <td className="py-3.5 px-4 text-slate-900">Total Neto Economizado al Año</td>
                        <td className="py-3.5 px-4 font-mono text-base text-indigo-800 bg-indigo-50/40">{formatCOP(comparison.indefinite.totalAnnualNet)}</td>
                        <td className="py-3.5 px-4 font-mono text-base text-amber-800 bg-amber-50/40">{formatCOP(comparison.services.totalAnnualNet)}</td>
                      </tr>
                      <tr className="font-extrabold bg-slate-900 text-white">
                        <td className="py-3 px-4 text-white">Equivalente Neto Real Mensualizado</td>
                        <td className="py-3 px-4 font-mono text-lg text-teal-300 bg-slate-800/80">{formatCOP(comparison.indefinite.equivalentMonthlyNet)}</td>
                        <td className="py-3 px-4 font-mono text-lg text-amber-300 bg-slate-800/60">{formatCOP(comparison.services.equivalentMonthlyNet)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                  <AlertCircle className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Explicación del consolidado mensualizado:</strong> Dividir el ingreso total transferido al año entre 12 meses es la única manera de comparar de forma correcta a nivel financiero. En el contrato indefinido, se percibe de forma invisible cerca de un <strong className="text-slate-800 font-semibold">{((comparison.indefinite.totalAnnualBenefitCount) / comparison.indefinite.grossWage * 100).toFixed(0)}% extra</strong> al salario base gracias a las prestaciones sociales ordinarias.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Pros y Contras Diferencias Legales */}
            {activeTab === "proscons" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contrato Indefinido benefits list */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Beneficios e Implicaciones de Ley</h3>
                      <p className="text-xs text-slate-400">Término Indefinido o Laboral</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-indigo-600 shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <p>
                        <strong>Prestaciones de ley completas:</strong> Primas en Junio y Diciembre, Cesantías e Intereses directos a tu fondo anualmente.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-indigo-600 shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <p>
                        <strong>Vacaciones pagadas:</strong> 15 días hábiles remunerados de descanso. No dejas de recibir tu sueldo normal por estar de vacaciones.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-indigo-600 shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <p>
                        <strong>Salud y Pensión subsidiados:</strong> Solo pagas el 4% de cada uno. Tu empleador asume el resto (8.5% de salud y 12% de pensión).
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-indigo-600 shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <p>
                        <strong>Protección ante despidos:</strong> Indemnización justa en caso de despido sin justa causa. Estabilidad a largo plazo.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-indigo-600 shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <p>
                        <strong>Acceso a créditos bancarios:</strong> Los bancos favorecen enormemente a postulantes con contratos indefinidos sobre independientes.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5 text-slate-400 italic">
                      <div className="mt-0.5 shrink-0">
                        <X className="w-4 h-4" />
                      </div>
                      <p>
                        <strong>Cumplimiento de horario:</strong> Debes cumplir un horario, órdenes directas y someterte a subordinación laboral habitual.
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Prestación de servicios duties & flex */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Obligaciones y Ventajas Independientes</h3>
                      <p className="text-xs text-slate-400">Prestación de Servicios</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-amber-600 shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <p>
                        <strong>Autonomía horaria:</strong> No existe la subordinación laboral; manejas tus tiempos de ejecución sin estar obligado a un horario.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 text-amber-600 shrink-0">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                      <p>
                        <strong>Múltiples contratos:</strong> Puedes prestar servicios a más de una empresa u organización en paralelo para escalar ingresos.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5 text-slate-400 italic">
                      <div className="mt-0.5 shrink-0">
                        <X className="w-4 h-4" />
                      </div>
                      <p>
                        <strong>Pagarás el 100% de aportes:</strong> Asumes enteramente salud (12.5%), pensión (16%) y ARL con tus propios recursos sobre el 40% del ingreso (IBC).
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5 text-slate-400 italic">
                      <div className="mt-0.5 shrink-0">
                        <X className="w-4 h-4" />
                      </div>
                      <p>
                        <strong>Sin primas ni cesantías:</strong> El contratante solo transfiere los honorarios crudos. Debes auto-completar tu ahorro.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5 text-slate-400 italic">
                      <div className="mt-0.5 shrink-0">
                        <X className="w-4 h-4" />
                      </div>
                      <p>
                        <strong>Vacaciones no pagadas:</strong> El día que decides no trabajar para descansar o viajar es un día no facturable en tu planilla de cobro.
                      </p>
                    </li>
                    <li className="flex items-start gap-2.5 text-slate-400 italic">
                      <div className="mt-0.5 shrink-0">
                        <X className="w-4 h-4" />
                      </div>
                      <p>
                        <strong>Carga administrativa:</strong> Debes presentar planilla de seguridad social cancelada mes a mes y cuenta de cobro para recibir el desembolso.
                      </p>
                    </li>
                  </ul>
                </div>

              </div>
            )}

            {/* Quick Helper Explainer Section */}
            <footer className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <span className="font-extrabold uppercase text-[10px] text-slate-600 tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                ¿Cómo funciona la cotización contractual?
              </span>
              <p className="leading-relaxed">
                En Colombia, la seguridad social por prestación de servicios se calcula sobre el <strong>Ingreso Base de Cotización (IBC)</strong>, equivalente al <strong>40% de los honorarios mensuales</strong>. Este IBC por ley nunca puede ser menor a 1 salario mínimo vigente ({formatCOP(settings.minimumWage)}) ni mayor a 25. Este simulador calcula y respeta estos límites de forma exacta según el marco tributario.
              </p>
            </footer>

          </main>

        </div>

      </div>
    </div>
  );
}
