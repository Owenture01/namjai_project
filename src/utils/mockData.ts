import { WaterTank, SensorReading, Alert, Report, MaintenanceLog, SensorStatus, ParameterThreshold, HygieneCampaign, User } from '../types';

export const mockTanks: WaterTank[] = [
  {
    id: '1',
    name: 'Tank 001A',
    locationName: 'Manivong Primary School',
    latitude: -1.3133,
    longitude: 36.7890,
    capacityLiters: 5000,
    installationDate: new Date('2023-01-15'),
    status: 'active',
    riskLevel: 'low',
  },
  {
    id: '2',
    name: 'Tank 002B',
    locationName: 'Maythany Community Center',
    latitude: -1.2611,
    longitude: 36.8578,
    capacityLiters: 10000,
    installationDate: new Date('2023-03-20'),
    status: 'active',
    riskLevel: 'high',
  },
  {
    id: '3',
    name: 'Tank 003C',
    locationName: 'Hinherb Health Clinic',
    latitude: -1.3028,
    longitude: 36.8833,
    capacityLiters: 7500,
    installationDate: new Date('2023-05-10'),
    status: 'active',
    riskLevel: 'medium',
  },
  {
    id: '4',
    name: 'Tank 004D',
    locationName: 'Xokxay Market',
    latitude: -1.2833,
    longitude: 36.7500,
    capacityLiters: 6000,
    installationDate: new Date('2023-07-01'),
    status: 'maintenance',
    riskLevel: 'critical',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@waterquality.org',
    fullName: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    email: 'field.officer@waterquality.org',
    fullName: 'Jane Kamau',
    role: 'field_officer',
    status: 'active',
    createdAt: new Date('2023-02-15'),
  },
  {
    id: '3',
    email: 'observer@waterquality.org',
    fullName: 'John Ochieng',
    role: 'observer',
    status: 'active',
    createdAt: new Date('2023-03-20'),
  },
];

export const defaultThresholds: ParameterThreshold[] = [
  { parameter: 'ph', minWarning: 6.5, maxWarning: 8.5, minCritical: 6.0, maxCritical: 9.0 },
  { parameter: 'turbidity', minWarning: 0, maxWarning: 5, minCritical: 0, maxCritical: 10 },
  { parameter: 'tds', minWarning: 0, maxWarning: 500, minCritical: 0, maxCritical: 1000 },
  { parameter: 'temperature', minWarning: 10, maxWarning: 30, minCritical: 5, maxCritical: 35 },
];

export function generateSensorReadings(tankId: string, hours: number = 24): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();

  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);

    const baseValues = tankId === '2' ? { ph: 8.8, turbidity: 7, tds: 520, temperature: 28 } :
                       tankId === '4' ? { ph: 9.2, turbidity: 12, tds: 850, temperature: 32 } :
                       { ph: 7.2, turbidity: 2, tds: 350, temperature: 22 };

    readings.push({
      id: `reading-${tankId}-${i}`,
      tankId,
      ph: baseValues.ph + (Math.random() - 0.5) * 0.5,
      turbidity: Math.max(0, baseValues.turbidity + (Math.random() - 0.5) * 2),
      tds: Math.max(0, baseValues.tds + (Math.random() - 0.5) * 50),
      temperature: baseValues.temperature + (Math.random() - 0.5) * 3,
      timestamp,
    });
  }

  return readings.reverse();
}

export const mockAlerts: Alert[] = [
  {
    id: '1',
    tankId: '2',
    tankName: 'Tank Beta',
    locationName: 'Mathare Community Center',
    alertType: 'ph',
    severity: 'warning',
    message: 'pH level exceeds warning threshold',
    parametersTriggered: [
      { parameter: 'pH', value: 8.7, threshold: '8.5 max' }
    ],
    acknowledged: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    tankId: '4',
    tankName: 'Tank Delta',
    locationName: 'Kawangware Market',
    alertType: 'multiple',
    severity: 'critical',
    message: 'Multiple parameters exceed critical thresholds',
    parametersTriggered: [
      { parameter: 'pH', value: 9.2, threshold: '9.0 max' },
      { parameter: 'Turbidity', value: 12.3, threshold: '10 NTU max' },
      { parameter: 'Temperature', value: 33, threshold: '30°C max' }
    ],
    acknowledged: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    tankId: '3',
    tankName: 'Tank Gamma',
    locationName: 'Mukuru Health Clinic',
    alertType: 'turbidity',
    severity: 'warning',
    message: 'Turbidity level elevated',
    parametersTriggered: [
      { parameter: 'Turbidity', value: 5.8, threshold: '5 NTU max' }
    ],
    acknowledged: true,
    acknowledgedBy: 'Jane Kamau',
    acknowledgedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

export const mockReports: Report[] = [
  {
    id: '1',
    tankId: '2',
    tankName: 'Tank Beta',
    submittedBy: '2',
    submittedByName: 'Jane Kamau',
    reportType: 'dirty_water',
    description: 'Water appears cloudy and has unusual odor. Community members reporting stomach issues.',
    status: 'under_review',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: '2',
    tankId: '4',
    tankName: 'Tank Delta',
    submittedBy: '3',
    submittedByName: 'John Ochieng',
    reportType: 'broken_filter',
    description: 'Primary filtration unit appears damaged. Water flow is reduced significantly.',
    photoUrl: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg',
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: '3',
    tankId: '1',
    tankName: 'Tank Alpha',
    submittedBy: '2',
    submittedByName: 'Jane Kamau',
    reportType: 'infrastructure',
    description: 'Crack observed in tank exterior wall. Requires immediate inspection.',
    status: 'resolved',
    reviewedBy: 'Admin User',
    reviewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    resolutionNotes: 'Inspection completed. Minor surface crack, no structural damage. Sealed and monitored.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export const mockMaintenanceLogs: MaintenanceLog[] = [
  {
    id: '1',
    tankId: '2',
    tankName: 'Tank Beta',
    maintenanceType: 'sensor_calibration',
    description: 'Quarterly calibration of all sensors',
    performedBy: '2',
    performedByName: 'Jane Kamau',
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    cost: 150,
  },
  {
    id: '2',
    tankId: '4',
    tankName: 'Tank Delta',
    maintenanceType: 'filter_replacement',
    description: 'Replace primary and secondary filters',
    performedBy: '2',
    performedByName: 'Jane Kamau',
    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completedDate: new Date(),
    status: 'in_progress',
    cost: 450,
    notes: 'Filters severely clogged. Recommend more frequent maintenance.',
  },
  {
    id: '3',
    tankId: '3',
    tankName: 'Tank Gamma',
    maintenanceType: 'tank_cleaning',
    description: 'Deep cleaning and sanitization',
    performedBy: '2',
    performedByName: 'Jane Kamau',
    scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'completed',
    cost: 300,
    notes: 'Cleaning completed successfully. Tank back in service.',
  },
];

export const mockSensorStatus: SensorStatus[] = [
  {
    id: '1',
    tankId: '1',
    tankName: 'Tank Alpha',
    sensorType: 'ph',
    status: 'operational',
    lastCalibration: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    nextCalibration: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    batteryLevel: 85,
    signalStrength: 95,
  },
  {
    id: '2',
    tankId: '2',
    tankName: 'Tank Beta',
    sensorType: 'turbidity',
    status: 'needs_calibration',
    lastCalibration: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    nextCalibration: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    batteryLevel: 72,
    signalStrength: 88,
  },
  {
    id: '3',
    tankId: '4',
    tankName: 'Tank Delta',
    sensorType: 'ph',
    status: 'faulty',
    lastCalibration: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    nextCalibration: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    batteryLevel: 45,
    signalStrength: 60,
  },
  {
    id: '4',
    tankId: '3',
    tankName: 'Tank Gamma',
    sensorType: 'temperature',
    status: 'operational',
    lastCalibration: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    nextCalibration: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
    batteryLevel: 92,
    signalStrength: 100,
  },
];

export const mockCampaigns: HygieneCampaign[] = [
  {
    id: '1',
    title: 'Handwashing Campaign - Kibera',
    description: 'Community education on proper handwashing techniques and waterborne disease prevention',
    locationName: 'Kibera',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    targetAudience: 'School children and families',
    participantsCount: 450,
    status: 'completed',
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Water Safety Workshop',
    description: 'Training on water testing, storage, and treatment methods',
    locationName: 'Mathare',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    targetAudience: 'Community health workers',
    participantsCount: 120,
    status: 'ongoing',
    createdBy: '2',
  },
];
