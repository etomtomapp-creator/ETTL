import { VehicleAsset, InvestmentPreset, PartnerEntity } from '../types';

export const LUXURY_VEHICLES: VehicleAsset[] = [
  {
    id: 'phantom-sovereign',
    name: 'ETTL Phantom Sovereign',
    category: 'Executive Sedan',
    tagline: 'The Pinnacle of Executive & Diplomatic Chauffeur Fleets',
    specs: {
      engine: '4.4L Twin-Turbo V8 Hybrid',
      rangePower: '530 HP / 750 Nm',
      acceleration: '0-100 km/h in 4.3s',
      fleetSize: 18,
      occupancyRate: '91.2% Average',
    },
    financials: {
      unitCost: 115000,
      dailyRentalRate: 480,
      monthlyGrossRevenue: 10800,
      projectedAnnualYield: 22.4,
      utilizationTarget: 89,
    },
    features: [
      'Executive rear lounge seating with acoustic privacy glass',
      'Dual-zone satellite telemetry with geofenced security lockdown',
      'Long-term corporate contracts with 5-star hotel chains and embassy escorts',
      'Asset-backed physical title held in trust for syndicate investors',
    ],
    colorOptions: [
      { name: 'Foodpanda Pink Metallic', hex: '#d70f64', roughness: 0.15, metalness: 0.85, clearcoat: 0.98 },
      { name: 'Pure Pearl White', hex: '#ffffff', roughness: 0.14, metalness: 0.2, clearcoat: 1.0 },
      { name: 'Monaco Silver', hex: '#94a3b8', roughness: 0.18, metalness: 0.85, clearcoat: 0.9 },
      { name: 'Rose Gold Champagne', hex: '#e8a5b8', roughness: 0.2, metalness: 0.8, clearcoat: 0.9 },
      { name: 'Obsidian Black', hex: '#0a0d14', roughness: 0.15, metalness: 0.9, clearcoat: 0.95 },
    ],
  },
  {
    id: 'cullinan-gt',
    name: 'ETTL Sovereign Grand Tourer',
    category: 'Grand Tourer SUV',
    tagline: 'Commanding High-Capacity Luxury for Elite Corporate Travel',
    specs: {
      engine: '4.0L Bi-Turbo V8 AWD',
      rangePower: '577 HP / 850 Nm',
      acceleration: '0-100 km/h in 4.5s',
      fleetSize: 14,
      occupancyRate: '87.8% Average',
    },
    financials: {
      unitCost: 140000,
      dailyRentalRate: 590,
      monthlyGrossRevenue: 13200,
      projectedAnnualYield: 20.8,
      utilizationTarget: 86,
    },
    features: [
      'All-terrain air suspension with whisper-quiet cabin insulation',
      'Private aviation airport runway transfers & executive summit contracts',
      'Full comprehensive telemetry with preventative sensor diagnostics',
      'Guaranteed secondary liquidation buyback guarantee at 36 months',
    ],
    colorOptions: [
      { name: 'Foodpanda Pink Metallic', hex: '#d70f64', roughness: 0.15, metalness: 0.85, clearcoat: 0.98 },
      { name: 'Pure Pearl White', hex: '#ffffff', roughness: 0.14, metalness: 0.2, clearcoat: 1.0 },
      { name: 'Monaco Silver', hex: '#94a3b8', roughness: 0.18, metalness: 0.85, clearcoat: 0.9 },
      { name: 'Rose Gold Satin', hex: '#f472b6', roughness: 0.22, metalness: 0.8, clearcoat: 0.85 },
      { name: 'Obsidian Black', hex: '#080a10', roughness: 0.15, metalness: 0.9, clearcoat: 0.95 },
    ],
  },
  {
    id: 'apex-electra',
    name: 'ETTL Apex Taycan EV',
    category: 'Performance EV',
    tagline: 'Zero-Emission Ultra-Performance Mobility for ESG Corporates',
    specs: {
      engine: 'Permanent Magnet Dual-Motor',
      rangePower: '670 HP / 520 km Range',
      acceleration: '0-100 km/h in 2.8s',
      fleetSize: 22,
      occupancyRate: '93.5% Average',
    },
    financials: {
      unitCost: 105000,
      dailyRentalRate: 460,
      monthlyGrossRevenue: 11400,
      projectedAnnualYield: 24.2,
      utilizationTarget: 92,
    },
    features: [
      '800-volt high-speed charging infrastructure compatibility',
      'Zero local emissions: Qualifies for corporate ESG lease subsidies',
      'Over-the-air firmware tracking & autonomous battery health optimization',
      'Highest utilization rate across tech enterprise client base',
    ],
    colorOptions: [
      { name: 'Foodpanda Pink Metallic', hex: '#d70f64', roughness: 0.15, metalness: 0.85, clearcoat: 0.98 },
      { name: 'Pure Pearl White', hex: '#ffffff', roughness: 0.14, metalness: 0.2, clearcoat: 1.0 },
      { name: 'Monaco Silver', hex: '#cbd5e1', roughness: 0.15, metalness: 0.9, clearcoat: 0.98 },
      { name: 'Rose Gold Metallic', hex: '#f472b6', roughness: 0.2, metalness: 0.82, clearcoat: 0.9 },
      { name: 'Obsidian Black', hex: '#0b0e17', roughness: 0.15, metalness: 0.9, clearcoat: 0.95 },
    ],
  },
];

export const INVESTMENT_PRESETS: InvestmentPreset[] = [
  {
    id: 'syndicate',
    title: 'Executive Syndicate',
    amount: 50000,
    vehiclesAllocated: 1,
    projectedAnnualYield: 19.8,
    quarterlyPayout: 2475,
    termMonths: 24,
    features: [
      'Fractional equity in 1 premium executive vehicle',
      'Quarterly revenue-share distributions via direct wire',
      'Monthly digital fleet telemetry & utilization reports',
      '100% comprehensive commercial insurance cover',
      '90-day exit liquidity notice window',
    ],
  },
  {
    id: 'corporate',
    title: 'Corporate Fleet Portfolio',
    amount: 150000,
    badge: 'Most Popular',
    vehiclesAllocated: 3,
    projectedAnnualYield: 21.6,
    quarterlyPayout: 8100,
    termMonths: 36,
    features: [
      'Full allocation across 3 dedicated high-yield vehicles',
      'Priority revenue-share distribution waterfall',
      'Dedicated private wealth manager and quarterly video briefing',
      '14 complimentary days of VIP luxury fleet usage per year',
      'Principal collateral protection with audited title deeds',
    ],
  },
  {
    id: 'institutional',
    title: 'Institutional Syndicate',
    amount: 500000,
    badge: 'Institutional Grade',
    vehiclesAllocated: 10,
    projectedAnnualYield: 24.2,
    quarterlyPayout: 30250,
    termMonths: 36,
    features: [
      'Wholesale bespoke fleet syndicate of 10+ vehicles',
      'Bespoke legal SPV structure registered in your entity name',
      'Direct priority contracts with Fortune 500 corporate clients',
      'Monthly automated dividend distributions',
      'Full capital liquidation buyback guarantee at end of term',
    ],
  },
];

export const PARTNERS_DATA: PartnerEntity[] = [
  {
    name: 'Marsh & McLennan Commercial',
    category: 'Risk & Asset Insurance',
    description: 'Tier-1 comprehensive fleet coverage protecting all physical vehicle assets against damage, loss, or commercial disruption.',
    logoText: 'MARSH RISK',
    metric: '$100M+ Aggregate Cover',
  },
  {
    name: 'Geotab Telematics & Satellite',
    category: 'Fleet Security & Telemetry',
    description: 'Military-grade 24/7 satellite GPS geofencing, real-time speed monitoring, remote ignition immobilizers, and predictive wear analytics.',
    logoText: 'GEOTAB PRO',
    metric: '99.98% Sensor Uptime',
  },
  {
    name: 'Apex Aviation VIP Transfers',
    category: 'Corporate Client Demand',
    description: 'Exclusive luxury tarmac escort contracts across 14 private jet terminals, driving high daily utilization rates.',
    logoText: 'APEX AIR',
    metric: '850+ Monthly Chauffeur Bookings',
  },
  {
    name: 'Swiss Re Capital Structuring',
    category: 'Collateral Assurance',
    description: 'Underwrites secondary market asset residual value, guaranteeing fixed floor liquidation prices after 24 to 36 months.',
    logoText: 'SWISS RE',
    metric: 'A+ Rated Solvency',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Strategic Fleet Acquisition',
    description: 'ETTL negotiates direct wholesale volume discounts with premier automotive manufacturers, acquiring brand-new luxury sedans and EVs at 15–20% below retail MSRP.',
    detail: 'Asset titles are held directly in trust with audited transparent serial numbers and registered investor covenants.',
  },
  {
    number: '02',
    title: 'Long-Term Corporate Leasing',
    description: 'Vehicles are deployed into high-margin contracts: multinational corporate executives, film production units, private jet terminals, and 5-star hospitality concierge suites.',
    detail: 'Average client lease contract spans 6 to 18 months with upfront commercial security deposits.',
  },
  {
    number: '03',
    title: 'Telematics & Maintenance Control',
    description: 'Every vehicle is tracked 24/7 via satellite telemetry. Automated maintenance schedules at certified dealer centers preserve pristine vehicle condition and secondary value.',
    detail: 'Zero owner operational burden: ETTL handles all maintenance, insurance renewals, cleaning, and dispatch.',
  },
  {
    number: '04',
    title: 'Quarterly Cashflow Payouts',
    description: 'Net rental revenues are audited and wired directly to your designated bank account every quarter, targeting 19.8% to 24.2% annualized returns.',
    detail: 'Receive digital statements detailing vehicle mileage, client lease fees, maintenance logs, and net yield.',
  },
];
