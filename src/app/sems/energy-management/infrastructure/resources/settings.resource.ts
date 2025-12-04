// src/app/sems/energy-management/infrastructure/resources/settings.resource.ts
export interface SavingRule {
  id: string;
  name: string;
  isEnabled: boolean;
}

export interface SettingsResource {
  id: string;
  userId: string;
  autoSavingMode: {
    turnOffPatio: boolean;
    turnOffDevices: boolean;
    unplugWeekdays: boolean;
    runDishwasher: boolean;
  };
  notifications: {
    highConsumption: boolean;
    summary: boolean;
    scheduleStart: string;
    scheduleEnd: string;
  };
  reportFrequencies: string[];
  reportFormats: string[];
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  rules?: SavingRule[];
}
