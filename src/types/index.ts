/**
 * Core Data Models for ETTL Investment Platform
 */

export interface VehicleAsset {
  id: string;
  name: string;
  category: 'Executive Sedan' | 'Grand Tourer SUV' | 'Performance EV';
  tagline: string;
  specs: {
    engine: string;
    rangePower: string;
    acceleration: string;
    fleetSize: number;
    occupancyRate: string;
  };
  financials: {
    unitCost: number;
    dailyRentalRate: number;
    monthlyGrossRevenue: number;
    projectedAnnualYield: number; // e.g. 22.4%
    utilizationTarget: number; // e.g. 89%
  };
  features: string[];
  colorOptions: {
    name: string;
    hex: string;
    roughness: number;
    metalness: number;
    clearcoat?: number;
  }[];
}

export interface InvestmentPreset {
  id: string;
  title: string;
  amount: number;
  badge?: string;
  vehiclesAllocated: number;
  projectedAnnualYield: number;
  quarterlyPayout: number;
  termMonths: number;
  features: string[];
}

export interface IntroDialogueStep {
  id: number;
  speaker: 'Narrator' | 'Receptionist' | 'Client' | 'Manager';
  text: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  characterPose?: string;
  options?: {
    id: 'prices' | 'details' | 'explore';
    label: string;
    sublabel: string;
  }[];
}

export interface PartnerEntity {
  name: string;
  category: string;
  description: string;
  logoText: string;
  metric: string;
}
