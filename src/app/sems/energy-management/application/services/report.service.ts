import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportRepositoryImpl } from '../../infrastructure/repositories/report-repository.impl';
import { Report, ReportType, ReportFormat, ReportPeriod } from '../../domain/model/entities/report.entity';
import { ReportGenerationParams } from '../../domain/model/repositories/report.repository';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private reportRepository: ReportRepositoryImpl) {}

  generateWeeklyConsumptionReport(format: ReportFormat = ReportFormat.PDF): Observable<Report> {
    return this.reportRepository.generateReport(
      ReportType.WEEKLY_CONSUMPTION,
      ReportPeriod.LAST_WEEK,
      format
    );
  }

  generateDeviceRankingReport(format: ReportFormat = ReportFormat.PDF): Observable<Report> {
    return this.reportRepository.generateReport(
      ReportType.DEVICE_RANKING,
      ReportPeriod.LAST_MONTH,
      format
    );
  }

  generateComprehensiveReport(
    period: ReportPeriod = ReportPeriod.LAST_MONTH,
    format: ReportFormat = ReportFormat.PDF
  ): Observable<Report> {
    return this.reportRepository.generateReport(
      ReportType.COMPREHENSIVE,
      period,
      format
    );
  }

  generateCustomReport(params: ReportGenerationParams): Observable<Report> {
    return this.reportRepository.generateReportWithParams(params);
  }

  getReport(id: string): Observable<Report> {
    return this.reportRepository.getReport(id);
  }

  getReportHistory(userId?: string): Observable<Report[]> {
    return this.reportRepository.getReportHistory(userId);
  }

  deleteReport(id: string): Observable<boolean> {
    return this.reportRepository.deleteReport(id);
  }

  // Utility methods for common report configurations
  getAvailableFormats(): ReportFormat[] {
    return [
      ReportFormat.PDF,
      ReportFormat.EXCEL,
      ReportFormat.CSV,
      ReportFormat.JSON
    ];
  }

  getAvailablePeriods(): ReportPeriod[] {
    return [
      ReportPeriod.LAST_WEEK,
      ReportPeriod.LAST_MONTH,
      ReportPeriod.LAST_QUARTER,
      ReportPeriod.LAST_YEAR
    ];
  }

  getAvailableTypes(): ReportType[] {
    return [
      ReportType.WEEKLY_CONSUMPTION,
      ReportType.DEVICE_RANKING,
      ReportType.COMPREHENSIVE,
      ReportType.CUSTOM
    ];
  }
}