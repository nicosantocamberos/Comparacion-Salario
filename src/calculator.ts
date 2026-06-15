/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CalculatorSettings,
  IndefiniteContractResults,
  ServicesContractResults,
  ComparisonSummary,
} from "./types";

// Standard Colombian ARL percentages
export const ARL_LEVELS = [
  { level: 1, rate: 0.00522, label: "Clase I (0.522%) - Administrativo, Oficinas" },
  { level: 2, rate: 0.01044, label: "Clase II (1.044%) - Comercial, Manufactura ligera" },
  { level: 3, rate: 0.02436, label: "Clase III (2.436%) - Operario, Talleres, Procesos" },
  { level: 4, rate: 0.04350, label: "Clase IV (4.350%) - Transporte, Manufactura pesada" },
  { level: 5, rate: 0.06960, label: "Clase V (6.960%) - Minería, Construcción extrema, Alto riesgo" },
];

export const DEFAULT_SETTINGS: CalculatorSettings = {
  minimumWage: 1430000,      // SMLMV Colombia 2026 / 2025 estimate
  auxTransport: 172000,      // Auxilio de transporte
  ibcPercentage: 0.40,       // 40%
  retencionFuentePerc: 0.04,  // Default average withhold (often 4% or 6% or 10% or 0% depending on status)
};

/**
 * Calculate Indefinite (Laboral) Contract income and benefits
 */
export function calculateIndefinite(
  grossWage: number,
  settings: CalculatorSettings
): IndefiniteContractResults {
  const healthDeduction = grossWage * 0.04;
  const pensionDeduction = grossWage * 0.04;
  
  // Auxilio de transporte is only for people earning <= 2 SMLMV
  const earnsAuxTransport = grossWage <= 2 * settings.minimumWage;
  const auxTransport = earnsAuxTransport ? settings.auxTransport : 0;
  
  const netMonthly = grossWage - healthDeduction - pensionDeduction + auxTransport;
  
  // Annual Benefits (Prestaciones de ley)
  // Prima is 1 full salary per year (based on gross salary + aux transport)
  const baseForBenefits = grossWage + auxTransport;
  
  const primaServices = baseForBenefits; // 1 salary
  const cesantias = baseForBenefits;     // 1 salary
  const interesesCesantias = cesantias * 0.12; // 12% of cesantias
  
  // Vacations is 15 business days (approx. 0.5 of gross wage, does not include aux transport in calculations)
  const vacationsValue = grossWage * 0.5;
  
  const totalAnnualNet = (netMonthly * 12) + primaServices + cesantias + interesesCesantias;
  const equivalentMonthlyNet = totalAnnualNet / 12;

  return {
    grossWage,
    healthDeduction,
    pensionDeduction,
    auxTransport,
    netMonthly,
    primaServices,
    cesantias,
    interesesCesantias,
    vacationsValue,
    totalAnnualBenefitCount: primaServices + cesantias + interesesCesantias,
    totalAnnualNet,
    equivalentMonthlyNet,
  };
}

/**
 * Calculate Services Contract (Contractor / Independiente) income and expenses
 */
export function calculateServices(
  grossRate: number,
  arlLevel: number,
  unpaidRestDays: number,
  settings: CalculatorSettings
): ServicesContractResults {
  // IBC calculation: 40% of bruto, capped between 1 SMLMV and 25 SMLMV
  const rawIbc = grossRate * settings.ibcPercentage;
  const ibc = Math.min(
    Math.max(rawIbc, settings.minimumWage),
    25 * settings.minimumWage
  );
  
  const healthPayment = ibc * 0.125;  // 12.5%
  const pensionPayment = ibc * 0.16;   // 16%
  
  const arlObj = ARL_LEVELS.find((a) => a.level === arlLevel) || ARL_LEVELS[0];
  const arlRate = arlObj.rate;
  const arlPayment = ibc * arlRate;
  
  // Optional / Custom withholding tax
  const retencionFuenteValue = grossRate * settings.retencionFuentePerc;
  
  const totalMonthlyDeductions = healthPayment + pensionPayment + arlPayment + retencionFuenteValue;
  const netMonthly = grossRate - totalMonthlyDeductions;
  
  // Unpaid vacation days effect:
  // If they take X rest days, that reduces their billing.
  // One day value is calculated as grossRate / 30
  const billingReductionPerDay = grossRate / 30;
  const annualBillingReduction = unpaidRestDays * billingReductionPerDay;
  
  // Total billing in 1 year = grossRate * 12 - annualBillingReduction
  const totalAnnualBilling = (grossRate * 12) - annualBillingReduction;
  
  // Total Annual Net = Annual billing minus 12 months of social security payments
  const totalAnnualNet = totalAnnualBilling - (totalMonthlyDeductions * 12);
  const equivalentMonthlyNet = totalAnnualNet / 12;

  return {
    grossRate,
    ibc,
    healthPayment,
    pensionPayment,
    arlLevel,
    arlRate,
    arlPayment,
    retencionFuenteValue,
    totalMonthlyDeductions,
    netMonthly,
    unpaidRestDays,
    annualBillingReduction,
    totalAnnualNet,
    equivalentMonthlyNet,
  };
}

/**
 * Calculate the comprehensive comparison between both systems, including solving for the Golden Rule
 */
export function compareSalaries(
  indefiniteGross: number,
  servicesGross: number,
  arlLevel: number,
  unpaidRestDays: number,
  settings: CalculatorSettings
): ComparisonSummary {
  const indefinite = calculateIndefinite(indefiniteGross, settings);
  const services = calculateServices(servicesGross, arlLevel, unpaidRestDays, settings);
  
  // Solve for Golden Rule: What gross services fee (Gs) yields services.equivalentMonthlyNet === indefinite.equivalentMonthlyNet?
  // We use binary search over Gs to find the matching value.
  const targetAnnualNet = indefinite.totalAnnualNet;
  let low = indefiniteGross;
  let high = indefiniteGross * 3;
  let goldenRuleFee = indefiniteGross * 1.35; // Default guess is +35%
  
  // Run 30 steps of binary search for extreme accuracy
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    const testResults = calculateServices(mid, arlLevel, unpaidRestDays, settings);
    if (testResults.totalAnnualNet < targetAnnualNet) {
      low = mid;
    } else {
      high = mid;
    }
  }
  goldenRuleFee = (low + high) / 2;
  
  // Let's protect against edge cases
  if (goldenRuleFee < indefiniteGross) {
    goldenRuleFee = indefiniteGross * 1.35;
  }

  const goldenRuleMarkupPercent = ((goldenRuleFee - indefiniteGross) / indefiniteGross) * 100;
  
  const isServicesBetterNetMonthly = services.netMonthly > indefinite.netMonthly;
  const isServicesBetterAnnual = services.totalAnnualNet > indefinite.totalAnnualNet;

  return {
    indefinite,
    services,
    goldenRuleFee,
    goldenRuleMarkupPercent,
    isServicesBetterNetMonthly,
    isServicesBetterAnnual,
  };
}
