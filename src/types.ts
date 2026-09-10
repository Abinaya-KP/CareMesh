export type FacilityType = 'PHC' | 'CHC' | 'TALUK_HOSPITAL' | 'DISTRICT_HOSPITAL';
export type RiskLevel = 'safe' | 'at-risk' | 'critical';

export interface Facility {
  id: string;
  code: string;
  name: string;
  type: FacilityType;
  district: string;
  location: string;
  coordinates: { x: number; y: number }; // percentage on map canvas
  patientLoad: number; // daily OPD
  status: RiskLevel;
  totalStockUnits: number;
  criticalMedicines: string[];
  shortageProbability: number; // 0-100%
  expiryRiskScore: number; // 0-100%
  assignedWarehouseId: string;
  primarySupplierId: string;
  deliveryETA: string;
  distanceKmFromDepot: number;
  accessibilityStatus: 'normal' | 'constrained' | 'blocked';
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  district: string;
  coordinates: { x: number; y: number };
  capacityUnits: number;
  currentStock: number;
  status: 'operational' | 'congested' | 'offline';
  connectedSuppliers: string[];
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  location: string;
  reliabilityScore: number; // 0-100%
  standardLeadTimeDays: number;
  status: 'normal' | 'delayed' | 'congested';
  coordinates: { x: number; y: number };
}

export interface Medicine {
  id: string;
  name: string;
  category: 'Antipyretic' | 'Antibiotic' | 'Hydration' | 'Endocrine' | 'Critical Care' | 'Emergency';
  form: string;
  unitCostINR: number;
  standardShelfLifeDays: number;
}

export interface FacilityMedicineRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityDistrict: string;
  medicineId: string;
  medicineName: string;
  category: string;
  currentStock: number;
  dailyConsumption: number;
  forecastDemand7d: number;
  daysRemaining: number; // strictly Current Stock / Daily Consumption
  shortageRisk: number; // 0-100%
  expiryQuantity: number;
  daysToExpiry: number;
  potentialWasteValueINR: number;
  expiryRiskLevel: 'low' | 'medium' | 'high';
  recommendedAction: 'Transfer Out' | 'Transfer In' | 'Urgent Reorder' | 'Optimal' | 'Buffer Stock Safe';
}

export interface CriticalAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'medium' | 'info';
  facilityId?: string;
  facilityName: string;
  medicineName?: string;
  type: 'shortage' | 'expiry' | 'supplier' | 'transit';
  daysRemaining?: number;
  timestamp: string;
  resolved?: boolean;
}

export interface RedistributionPlan {
  id: string;
  medicine: string;
  fromFacilityId: string;
  fromFacilityName: string;
  fromDistrict: string;
  toFacilityId: string;
  toFacilityName: string;
  toDistrict: string;
  quantity: number;
  beforeShortageRisk: number;
  afterShortageRisk: number;
  beforeExpiryRisk: 'Low' | 'Medium' | 'High';
  afterExpiryRisk: 'Low' | 'Medium' | 'High';
  estimatedDeliveryHours: number;
  distanceKm: number;
  reason: string;
  confidence: number;
  costSavingsINR: number;
  whyBreakdown?: string[];
  expectedImpact?: string[];
  status: 'recommended' | 'in-transit' | 'executed';
}

export type ScenarioId = 'baseline' | 'dengue' | 'supplier_delay' | 'flood' | 'patient_surge' | 'warehouse_failure';

export interface EmergencyScenario {
  id: ScenarioId;
  name: string;
  badge: string;
  description: string;
  demandMultiplier: number;
  leadTimeImpactDays: number;
  affectedRegions: string[];
}

export type LanguageCode = 'en';

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  badge?: string;
}

export interface NetworkHealthStats {
  totalFacilities: number;
  medicinesMonitored: number;
  criticalFacilities: number;
  atRiskFacilities: number;
  safeFacilities: number;
  resilienceScore: number;
  potentialWastePreventedINR: string;
  activeRedistributionsCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
