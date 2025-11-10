// src/app/sems/energy-management/infrastructure/repositories/settings-repository.impl.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingsRepository } from '../../domain/model/repositories/settings.repository';
import { SettingsResponse } from '../response/settings.response';
import { SettingsRequest } from '../request/settings.request';
import { environment } from '../../../../../environments/environments';

const BASE_URL = `${environment.apiUrl}/api/v1/settings`;

@Injectable({
  providedIn: 'root'
})
export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(environment.tokenKey);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUserSettings(userId: string): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(`${BASE_URL}/${userId}`, {
      headers: this.getHeaders()
    });
  }

  updateSettings(userId: string, request: SettingsRequest): Observable<SettingsResponse> {
    return this.http.put<SettingsResponse>(`${BASE_URL}/${userId}`, request, {
      headers: this.getHeaders()
    });
  }

  resetToDefaults(userId: string): Observable<SettingsResponse> {
    return this.http.post<SettingsResponse>(`${BASE_URL}/${userId}/reset`, {}, {
      headers: this.getHeaders()
    });
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/${userId}/password`, {
      oldPassword,
      newPassword
    }, {
      headers: this.getHeaders()
    });
  }

  enableTwoFactor(userId: string): Observable<{ qrCode: string; secret: string }> {
    return this.http.post<{ qrCode: string; secret: string }>(
      `${BASE_URL}/${userId}/2fa/enable`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
