// src/app/sems/energy-management/infrastructure/assemblers/settings.assembler.ts
import { Injectable } from '@angular/core';
import { SettingsResponse } from '../response/settings.response';
import { SettingsResource } from '../resources/settings.resource';
import { SettingsRequest } from '../request/settings.request';

@Injectable({
  providedIn: 'root'
})
export class SettingsAssembler {
  toResource(dto: SettingsResponse): SettingsResource {
    return {
      id: dto.id,
      userId: dto.userId,
      autoSavingMode: dto.autoSavingMode,
      notifications: dto.notifications,
      reportFrequencies: dto.reportFrequencies,
      reportFormats: dto.reportFormats,
      twoFactorEnabled: dto.twoFactorEnabled,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };
  }

  toRequest(resource: Partial<SettingsResource>): SettingsRequest {
    return {
      autoSavingMode: resource.autoSavingMode,
      notifications: resource.notifications,
      reportFrequencies: resource.reportFrequencies,
      reportFormats: resource.reportFormats,
      twoFactorEnabled: resource.twoFactorEnabled
    };
  }
}
