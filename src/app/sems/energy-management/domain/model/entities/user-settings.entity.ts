// src/app/sems/energy-management/domain/model/entities/user-settings.entity.ts
export interface AutoSavingModeConfig {
  turnOffPatio: boolean;
  turnOffDevices: boolean;
  unplugWeekdays: boolean;
  runDishwasher: boolean;
}

export interface NotificationConfig {
  highConsumption: boolean;
  summary: boolean;
  scheduleStart: string;
  scheduleEnd: string;
}

export interface UserSettingsEntity {
  id: string;
  userId: string;
  autoSavingMode: AutoSavingModeConfig;
  notifications: NotificationConfig;
  reportFrequencies: string[];
  reportFormats: string[];
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
