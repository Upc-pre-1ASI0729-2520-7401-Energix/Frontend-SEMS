// src/app/sems/energy-management/infrastructure/assemblers/settings.assembler.ts
import { Injectable } from '@angular/core';
import { SettingsResponse } from '../response/settings.response';
import { SettingsResource } from '../resources/settings.resource';
import { SettingsRequest } from '../request/settings.request';

@Injectable({
  providedIn: 'root'
})
export class SettingsAssembler {
  toResource(dto: any): SettingsResource {
    // Handle flat structure from backend (matching user_settings table)
    // The backend likely returns a flat JSON object now

    return {
      id: dto.id,
      userId: dto.userId || dto.user_id,
      autoSavingMode: {
        turnOffPatio: dto.turnOffPatio ?? dto.turn_off_patio ?? dto.autoSavingMode?.turnOffPatio,
        turnOffDevices: dto.turnOffDevices ?? dto.turn_off_devices ?? dto.autoSavingMode?.turnOffDevices,
        unplugWeekdays: dto.unplugWeekdays ?? dto.unplug_weekdays ?? dto.autoSavingMode?.unplugWeekdays,
        runDishwasher: dto.runDishwasher ?? dto.run_dishwasher ?? dto.autoSavingMode?.runDishwasher
      },
      notifications: {
        highConsumption: dto.highConsumption ?? dto.high_consumption_alerts ?? dto.high_consumption ?? dto.notifications?.highConsumption,
        summary: dto.summary ?? dto.daily_weekly_summary ?? dto.daily_weekly ?? dto.notifications?.summary,
        scheduleStart: dto.scheduleStart ?? dto.notification_schedule_start ?? dto.schedule_start ?? dto.notifications?.scheduleStart,
        scheduleEnd: dto.scheduleEnd ?? dto.notification_schedule_end ?? dto.schedule_end ?? dto.notifications?.scheduleEnd
      },
      reportFrequencies: dto.reportFrequencies || dto.report_frequencies || [],
      reportFormats: dto.reportFormats || dto.report_formats || [],
      twoFactorEnabled: dto.twoFactorEnabled ?? dto.two_factor_enabled,
      createdAt: new Date(dto.createdAt || dto.created_at || Date.now()),
      updatedAt: new Date(dto.updatedAt || dto.updated_at || Date.now()),
      rules: (dto.savingRules || dto.saving_rules)?.map((r: any) => ({
        id: r.id,
        name: r.name,
        isEnabled: r.isEnabled ?? r.is_enabled
      }))
    };
  }

  toRequest(resource: Partial<SettingsResource>): any {
    // Flatten the structure to match the user_settings table columns directly
    return {
      id: resource.id,
      user_id: resource.userId,

      // Auto Saving Mode columns
      turn_off_patio: resource.autoSavingMode?.turnOffPatio,
      turn_off_devices: resource.autoSavingMode?.turnOffDevices,
      unplug_weekdays: resource.autoSavingMode?.unplugWeekdays,
      run_dishwasher: resource.autoSavingMode?.runDishwasher,

      // Notifications columns
      high_consumption_alerts: resource.notifications?.highConsumption,
      daily_weekly_summary: resource.notifications?.summary,
      notification_schedule_start: resource.notifications?.scheduleStart,
      notification_schedule_end: resource.notifications?.scheduleEnd,

      // Also map legacy/alternative names just in case
      notifications_enabled: true, // Assuming enabled if settings exist
      high_consumption: resource.notifications?.highConsumption,
      summary: resource.notifications?.summary,
      schedule_start: resource.notifications?.scheduleStart,
      schedule_end: resource.notifications?.scheduleEnd,

      // Other columns
      report_frequencies: resource.reportFrequencies,
      report_formats: resource.reportFormats,
      two_factor_enabled: resource.twoFactorEnabled,

      // Keep nested rules as they are likely a separate table/relation
      savingRules: resource.rules?.map(r => ({
        id: r.id,
        name: r.name,
        isEnabled: r.isEnabled
      }))
    };
  }
}
