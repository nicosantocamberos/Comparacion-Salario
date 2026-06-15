/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalculatorSettings {
  minimumWage: number;       // SMLMV in COP
  auxTransport: number;       // Auxilio de transporte in COP
  ibcPercentage: number;     // e.g., 0.40 (40%)
  retencionFuentePerc: number;// Custom withholding tax percentage (e.g. 0% - 15%)
}

export interface IndefiniteContractResults {
  grossWage: number;
  healthDeduction: number;
  pensionDeduction: number;
  auxTransport: number;
  netMonthly: number;
  
  // Annualized extras
  primaServices: number;
  cesantias: number;
  interesesCesantias: number;
  vacationsValue: number;    // 15 days of paid time off
  
  totalAnnualBenefitCount: number; // Sum of benefits and wages
  totalAnnualNet: number;
  equivalentMonthlyNet: number; // totalAnnualNet / 12
}

export interface ServicesContractResults {
  grossRate: number;
  ibc: number;
  healthPayment: number;
  pensionPayment: number;
  arlLevel: number;
  arlRate: number;
  arlPayment: number;
  retencionFuenteValue: number;
  totalMonthlyDeductions: number;
  netMonthly: number;
  
  // Unpaid vacation effect
  unpaidRestDays: number;
  annualBillingReduction: number;
  
  totalAnnualNet: number;
  equivalentMonthlyNet: number;
}

export interface ComparisonSummary {
  indefinite: IndefiniteContractResults;
  services: ServicesContractResults;
  goldenRuleFee: number;
  goldenRuleMarkupPercent: number;
  isServicesBetterNetMonthly: boolean;
  isServicesBetterAnnual: boolean;
}
