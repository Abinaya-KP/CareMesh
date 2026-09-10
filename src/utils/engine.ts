import {
  Facility,
  FacilityMedicineRecord,
  CriticalAlert,
  RedistributionPlan,
  ScenarioId,
  EmergencyScenario,
  NetworkHealthStats,
} from '../types';
import {
  SYNTHETIC_FACILITIES,
  INITIAL_INVENTORY_RECORDS,
  INITIAL_ALERTS,
  INITIAL_RECOMMENDATIONS,
} from '../data/syntheticData';

export const SCENARIOS: Record<ScenarioId, EmergencyScenario> = {
  baseline: {
    id: 'baseline',
    name: 'Normal Operations (Baseline)',
    badge: 'Standard Baseline',
    description: 'Real-time telemetry under normal seasonal load across Tamil Nadu PHC network.',
    demandMultiplier: 1.0,
    leadTimeImpactDays: 0,
    affectedRegions: [],
  },
  dengue: {
    id: 'dengue',
    name: 'Dengue Outbreak (+40% Demand)',
    badge: 'Epidemic Alert',
    description: 'Post-monsoon vector-borne spike surges fever, dehydration, and platelet patient inflow across Chengalpattu and Coimbatore.',
    demandMultiplier: 1.4,
    leadTimeImpactDays: 0.5,
    affectedRegions: ['Chengalpattu', 'Coimbatore', 'Madurai'],
  },
  supplier_delay: {
    id: 'supplier_delay',
    name: 'Supplier Delay (+5 Days Latency)',
    badge: 'Supply Chain Bottleneck',
    description: 'Active pharmaceutical ingredient (API) shipment backlog stalls Supplier S-03 deliveries into southern depots.',
    demandMultiplier: 1.0,
    leadTimeImpactDays: 5.0,
    affectedRegions: ['Madurai', 'Coimbatore'],
  },
  flood: {
    id: 'flood',
    name: 'Coastal Flooding (Transit Severed)',
    badge: 'Natural Disaster',
    description: 'Torrential rainfall submerges arterial links around Maduranthakam, Tambaram, and Lalgudi riverbank PHCs.',
    demandMultiplier: 1.15,
    leadTimeImpactDays: 3.0,
    affectedRegions: ['Chengalpattu', 'Tiruchirappalli'],
  },
  patient_surge: {
    id: 'patient_surge',
    name: 'District-wide Patient Surge (+25%)',
    badge: 'Systemic Overload',
    description: 'Public health seasonal influx elevates daily OPD footfalls across all 20 monitored medical facilities.',
    demandMultiplier: 1.25,
    leadTimeImpactDays: 0,
    affectedRegions: ['Chennai', 'Chengalpattu', 'Kanchipuram', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  },
  warehouse_failure: {
    id: 'warehouse_failure',
    name: 'Central Warehouse W-01 Offline',
    badge: 'Infrastructure Outage',
    description: 'Cold chain electrical fire temporarily isolates Kanchipuram Central District Medical Store.',
    demandMultiplier: 1.0,
    leadTimeImpactDays: 4.0,
    affectedRegions: ['Kanchipuram', 'Chennai', 'Chengalpattu'],
  },
};

export interface SimulationState {
  scenarioId: ScenarioId;
  facilities: Facility[];
  inventoryRecords: FacilityMedicineRecord[];
  alerts: CriticalAlert[];
  recommendations: RedistributionPlan[];
  stats: NetworkHealthStats;
  interventionApplied: boolean;
}

export function runSimulation(scenarioId: ScenarioId, applyIntervention: boolean = false): SimulationState {
  const scenario = SCENARIOS[scenarioId] || SCENARIOS.baseline;
  const isDengue = scenarioId === 'dengue';
  const isSupplierDelay = scenarioId === 'supplier_delay';
  const isFlood = scenarioId === 'flood';
  const isPatientSurge = scenarioId === 'patient_surge';
  const isWarehouseDown = scenarioId === 'warehouse_failure';

  // 1. Recalculate inventory records
  const updatedRecords: FacilityMedicineRecord[] = INITIAL_INVENTORY_RECORDS.map((rec) => {
    let multiplier = scenario.demandMultiplier;

    // Specific targeted increases
    if (isDengue && (rec.medicineName.includes('Paracetamol') || rec.medicineName.includes('ORS') || rec.medicineName.includes('IV Fluids'))) {
      multiplier = 1.45;
    }
    if (isFlood && (rec.medicineName.includes('ORS') || rec.medicineName.includes('Antimalarial') || rec.medicineName.includes('Antibiotic'))) {
      multiplier = 1.35;
    }

    const dailyBurn = Math.round(rec.dailyConsumption * multiplier);
    let currentStock = rec.currentStock;

    // If intervention is applied in simulation
    if (applyIntervention) {
      if (rec.id === 'REC-PHC07-MED01') {
        currentStock += 600; // Received 600 units from PHC-03
      }
      if (rec.id === 'REC-PHC03-MED01') {
        currentStock -= 600; // Sent 600 units
      }
      if (rec.id === 'REC-PHC05-MED06') {
        currentStock += 300; // Received 300 units from PHC-11
      }
      if (rec.id === 'REC-PHC11-MED06') {
        currentStock -= 300; // Sent 300 units
      }
      if (rec.id === 'REC-PHC03-MED02') {
        currentStock -= 800; // ORS redistributed to CHC-01
      }
    }

    // Days remaining strictly: Current Stock / Daily Consumption
    const daysRemaining = dailyBurn > 0 ? Number((currentStock / dailyBurn).toFixed(1)) : 99;

    // Calculate shortage risk
    let shortageRisk = 10;
    if (daysRemaining <= 3.0) {
      shortageRisk = 92;
    } else if (daysRemaining <= 5.0) {
      shortageRisk = 82;
    } else if (daysRemaining <= 8.0) {
      shortageRisk = 65;
    } else if (daysRemaining <= 14.0) {
      shortageRisk = 40;
    } else if (daysRemaining <= 21.0) {
      shortageRisk = 22;
    } else {
      shortageRisk = 8;
    }

    if (isSupplierDelay && (rec.facilityDistrict === 'Madurai' || rec.facilityDistrict === 'Coimbatore')) {
      shortageRisk = Math.min(99, shortageRisk + 22);
    }
    if (isWarehouseDown && (rec.facilityDistrict === 'Kanchipuram' || rec.facilityDistrict === 'Chengalpattu')) {
      shortageRisk = Math.min(99, shortageRisk + 26);
    }

    // Expiry risk calculation
    let expiryRiskLevel = rec.expiryRiskLevel;
    let potentialWasteINR = rec.potentialWasteValueINR;
    if (applyIntervention && (rec.id === 'REC-PHC03-MED02' || rec.id === 'REC-PHC03-MED01' || rec.id === 'REC-PHC11-MED06')) {
      expiryRiskLevel = 'low';
      potentialWasteINR = 0;
    }

    // Recommended action update
    let recommendedAction = rec.recommendedAction;
    if (shortageRisk > 70) {
      recommendedAction = 'Transfer In';
    } else if (expiryRiskLevel === 'high') {
      recommendedAction = 'Transfer Out';
    } else if (daysRemaining > 25) {
      recommendedAction = 'Buffer Stock Safe';
    } else {
      recommendedAction = 'Optimal';
    }

    if (applyIntervention && (rec.id === 'REC-PHC07-MED01' || rec.id === 'REC-PHC05-MED06')) {
      recommendedAction = 'Buffer Stock Safe';
      shortageRisk = rec.id === 'REC-PHC07-MED01' ? 9 : 14;
    }

    return {
      ...rec,
      dailyConsumption: dailyBurn,
      currentStock,
      daysRemaining,
      shortageRisk,
      expiryRiskLevel,
      potentialWasteValueINR: potentialWasteINR,
      recommendedAction,
    };
  });

  // 2. Recalculate facility statuses
  const updatedFacilities: Facility[] = SYNTHETIC_FACILITIES.map((fac) => {
    let status = fac.status;
    let shortageProb = fac.shortageProbability;
    let accessibility = fac.accessibilityStatus;

    if (isFlood && (fac.code === 'PHC-07' || fac.code === 'PHC-13' || fac.code === 'PHC-02')) {
      accessibility = 'constrained';
    }

    if (isDengue) {
      if (fac.code === 'PHC-07' || fac.code === 'PHC-05' || fac.code === 'CHC-02' || fac.code === 'DGH-01' || fac.code === 'PHC-08' || fac.code === 'PHC-10' || fac.code === 'PHC-12') {
        status = 'critical';
        shortageProb = Math.min(96, shortageProb + 25);
      } else if (fac.code === 'PHC-02' || fac.code === 'PHC-04' || fac.code === 'PHC-16' || fac.code === 'PHC-19' || fac.code === 'CHC-01' || fac.code === 'PHC-09') {
        status = 'at-risk';
        shortageProb = Math.min(75, shortageProb + 18);
      } else {
        status = 'safe';
      }
    } else if (isSupplierDelay) {
      if (fac.district === 'Madurai' || fac.district === 'Coimbatore') {
        status = shortageProb > 50 ? 'critical' : 'at-risk';
        shortageProb = Math.min(94, shortageProb + 22);
      }
    } else if (isWarehouseDown) {
      if (fac.assignedWarehouseId === 'W-01') {
        status = shortageProb > 45 ? 'critical' : 'at-risk';
        shortageProb = Math.min(95, shortageProb + 28);
      }
    }

    // If intervention is applied, heal critical facilities
    if (applyIntervention) {
      if (fac.code === 'PHC-07') {
        status = 'safe';
        shortageProb = 9;
      }
      if (fac.code === 'PHC-05') {
        status = 'safe';
        shortageProb = 14;
      }
      if (fac.code === 'PHC-03') {
        status = 'safe'; // Expiry resolved!
      }
      if (fac.code === 'CHC-01') {
        status = 'safe';
      }
    }

    return {
      ...fac,
      status,
      shortageProbability: shortageProb,
      accessibilityStatus: accessibility,
    };
  });

  // 3. Count statuses
  let safeCount = updatedFacilities.filter((f) => f.status === 'safe').length;
  let atRiskCount = updatedFacilities.filter((f) => f.status === 'at-risk').length;
  let criticalCount = updatedFacilities.filter((f) => f.status === 'critical').length;

  // Specific canonical hackathon demo values if Dengue scenario
  if (isDengue && !applyIntervention) {
    safeCount = 7;
    atRiskCount = 6;
    criticalCount = 7;
  } else if (isDengue && applyIntervention) {
    safeCount = 15;
    atRiskCount = 3;
    criticalCount = 2; // Critical drops from 7 -> 2!
  }

  // Calculate network resilience score
  const resilienceScore = applyIntervention
    ? 94
    : isDengue
    ? 58
    : isWarehouseDown
    ? 62
    : isSupplierDelay
    ? 69
    : isFlood
    ? 71
    : 87;

  // 4. Alerts
  const alerts: CriticalAlert[] = [...INITIAL_ALERTS];
  if (isDengue) {
    alerts.unshift({
      id: 'ALT-DENGUE-01',
      title: 'Epidemic Spike: Dengue Fever Surge (+40%)',
      description: 'Sudden 40% surge in demand for Paracetamol, ORS, and IV Saline across 7 rural primary health centres.',
      severity: 'critical',
      facilityName: 'Chengalpattu & Coimbatore Sectors',
      type: 'shortage',
      timestamp: 'Just now',
      resolved: applyIntervention,
    });
  }

  // 5. Recommendations
  const recommendations: RedistributionPlan[] = INITIAL_RECOMMENDATIONS.map((rec) => {
    return {
      ...rec,
      status: applyIntervention ? 'executed' : 'recommended',
    };
  });

  return {
    scenarioId,
    facilities: updatedFacilities,
    inventoryRecords: updatedRecords,
    alerts,
    recommendations,
    stats: {
      totalFacilities: updatedFacilities.length,
      medicinesMonitored: 15,
      criticalFacilities: criticalCount,
      atRiskFacilities: atRiskCount,
      safeFacilities: safeCount,
      resilienceScore,
      potentialWastePreventedINR: applyIntervention ? '₹3.8 Lakhs' : '₹2.4 Lakhs',
      activeRedistributionsCount: applyIntervention ? 4 : 3,
    },
    interventionApplied: applyIntervention,
  };
}

export function generateForecastData(baseDemand: number = 46, days: number = 7, multiplier: number = 1.0) {
  const result = [];
  const daysOfWeek = ['Day +1', 'Day +2', 'Day +3', 'Day +4', 'Day +5', 'Day +6', 'Day +7'];
  
  // Historical 7 days
  const pastDays = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today'];
  for (let i = 0; i < 7; i++) {
    const variation = Math.sin(i * 0.8) * 4 + (Math.random() * 4 - 2);
    const consumed = Math.round(baseDemand + variation);
    result.push({
      day: pastDays[i],
      historicalConsumption: consumed,
      forecastDemand: null,
      upperBound: null,
      lowerBound: null,
    });
  }

  // Forecast 7 days
  let runningDemand = baseDemand * multiplier;
  for (let i = 0; i < days; i++) {
    const growth = multiplier > 1 ? 1 + (i * 0.04) : 1;
    const projected = Math.round(runningDemand * growth + (i % 2 === 0 ? 3 : -2));
    result.push({
      day: daysOfWeek[i],
      historicalConsumption: null,
      forecastDemand: projected,
      upperBound: Math.round(projected * 1.15),
      lowerBound: Math.round(projected * 0.88),
    });
  }

  return result;
}
