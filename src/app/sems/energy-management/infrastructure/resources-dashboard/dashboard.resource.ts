import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardStatsResponse,
  DailyConsumptionResponse,
  ConsumptionByCategoryResponse,
  MonthlyComparisonResponse,
  DeviceResponse
} from '../response/dashboard.response';
import {
  DashboardStatsRequest,
  DailyConsumptionRequest,
  ConsumptionByCategoryRequest,
  MonthlyComparisonRequest,
  DevicesRequest
} from '../request/dashboard.request';
import { environment } from '../../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardResource {

  constructor(
    private readonly http: HttpClient
  ) {}

  getDashboardStats(request: DashboardStatsRequest): Observable<DashboardStatsResponse> {
    const params = new HttpParams().set('_ts', Date.now().toString());
    console.log('DashboardResource: fetching dashboardStats', `${environment.apiUrl}/dashboardStats`, params);
    return this.http.get<DashboardStatsResponse>(`${environment.apiUrl}/dashboardStats`, { params });
  }

  getDailyConsumption(request: DailyConsumptionRequest): Observable<DailyConsumptionResponse> {
    const params = new HttpParams().set('_ts', Date.now().toString());
    console.log('DashboardResource: fetching dailyConsumption', `${environment.apiUrl}/dailyConsumption`, params);
    return this.http.get<DailyConsumptionResponse>(`${environment.apiUrl}/dailyConsumption`, { params });
  }

  getConsumptionByCategory(request: ConsumptionByCategoryRequest): Observable<ConsumptionByCategoryResponse> {
    const params = new HttpParams().set('_ts', Date.now().toString());
    console.log('DashboardResource: fetching consumptionByCategory', `${environment.apiUrl}/consumptionByCategory`, params);
    return this.http.get<ConsumptionByCategoryResponse>(`${environment.apiUrl}/consumptionByCategory`, { params });
  }

  getMonthlyComparison(request: MonthlyComparisonRequest): Observable<MonthlyComparisonResponse> {
    const params = new HttpParams().set('_ts', Date.now().toString());
    console.log('DashboardResource: fetching monthlyComparison', `${environment.apiUrl}/monthlyComparison`, params);
    return this.http.get<MonthlyComparisonResponse>(`${environment.apiUrl}/monthlyComparison`, { params });
  }

  getDevices(request: DevicesRequest): Observable<DeviceResponse[]> {
    const params = new HttpParams().set('_ts', Date.now().toString());
    console.log('DashboardResource: fetching devices', `${environment.apiUrl}/devices`, params);
    return this.http.get<DeviceResponse[]>(`${environment.apiUrl}/devices`, { params });
  }
}
