// src/app/sems/energy-management/infrastructure/request/settings.request.ts
export interface SettingsRequest {
  id?: string;
  userId?: string;
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
  savingRules?: {
    id?: string;
    name?: string;
    isEnabled?: boolean;
  }[];
}
