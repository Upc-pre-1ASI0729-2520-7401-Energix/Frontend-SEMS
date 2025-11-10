// src/app/sems/energy-management/infrastructure/request/settings.request.ts
export interface SettingsRequest {
  autoSavingMode?: {
    turnOffPatio?: boolean;
    turnOffDevices?: boolean;
    unplugWeekdays?: boolean;
    runDishwasher?: boolean;
  };
  notifications?: {
    highConsumption?: boolean;
    summary?: boolean;
    scheduleStart?: string;
    scheduleEnd?: string;
  };
  reportFrequencies?: string[];
  reportFormats?: string[];
  twoFactorEnabled?: boolean;
}
