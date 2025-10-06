export interface ReportResponse {
  id: string;
  type: string;
  format: string;
  period: string;
  generatedAt: string; // ISO date string
  data: ReportDataResponse;
  metadata: ReportMetadataResponse;
  status: 'generated' | 'processing' | 'failed';
}

export interface ReportDataResponse {
  weeklyConsumption?: WeeklyConsumptionResponse[];
  deviceRanking?: DeviceRankingResponse[];
  totalConsumption: number;
  averageConsumption: number;
  peakConsumption: number;
  efficiencyScore: number;
  summary: ReportSummaryResponse;
}

export interface WeeklyConsumptionResponse {
  week: string;
  consumption: number;
  date: string; // ISO date string
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DeviceRankingResponse {
  deviceId: string;
  deviceName: string;
  consumption: number;
  percentage: number;
  category: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastUpdated: string; // ISO date string
}

export interface ReportMetadataResponse {
  title: string;
  description: string;
  generatedBy: string;
  exportedAt?: string; // ISO date string
  recipients?: string[];
  fileSize?: number;
  language: 'en' | 'es';
  version: string;
}

export interface ReportSummaryResponse {
  totalDevices: number;
  activeDevices: number;
  totalConsumptionPeriod: number;
  averageConsumptionPerDevice: number;
  mostEfficientDevice: string;
  leastEfficientDevice: string;
  recommendations: string[];
}

export interface ReportListResponse {
  reports: ReportResponse[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}