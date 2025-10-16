export type UserRole = 'admin' | 'field_officer' | 'observer';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}

export interface WaterTank {
  id: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  capacityLiters: number;
  installationDate: Date;
  status: 'active' | 'maintenance' | 'inactive';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SensorReading {
  id: string;
  tankId: string;
  ph: number;
  turbidity: number;
  tds: number;
  temperature: number;
  timestamp: Date;
}

export interface Alert {
  id: string;
  tankId: string;
  tankName: string;
  locationName: string;
  alertType: 'ph' | 'turbidity' | 'tds' | 'temperature' | 'multiple';
  severity: 'warning' | 'critical';
  message: string;
  parametersTriggered: {
    parameter: string;
    value: number;
    threshold: string;
  }[];
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

export interface Report {
  id: string;
  tankId: string;
  tankName: string;
  submittedBy: string;
  submittedByName: string;
  reportType: 'dirty_water' | 'broken_filter' | 'infrastructure' | 'other';
  description: string;
  photoUrl?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
  resolutionNotes?: string;
  createdAt: Date;
}

export interface MaintenanceLog {
  id: string;
  tankId: string;
  tankName: string;
  maintenanceType: 'sensor_calibration' | 'sensor_replacement' | 'tank_cleaning' | 'filter_replacement' | 'repair' | 'inspection';
  description: string;
  performedBy: string;
  performedByName: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost: number;
  notes?: string;
}

export interface SensorStatus {
  id: string;
  tankId: string;
  tankName: string;
  sensorType: 'ph' | 'turbidity' | 'tds' | 'temperature';
  status: 'operational' | 'needs_calibration' | 'faulty' | 'offline';
  lastCalibration?: Date;
  nextCalibration?: Date;
  batteryLevel: number;
  signalStrength: number;
}

export interface ParameterThreshold {
  parameter: 'ph' | 'turbidity' | 'tds' | 'temperature';
  minWarning: number;
  maxWarning: number;
  minCritical: number;
  maxCritical: number;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushAlerts: boolean;
  alertSeverityFilter: 'all' | 'critical_only';
  dailySummary: boolean;
}

export interface HygieneCampaign {
  id: string;
  title: string;
  description: string;
  locationName: string;
  startDate: Date;
  endDate: Date;
  targetAudience: string;
  participantsCount: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
}
