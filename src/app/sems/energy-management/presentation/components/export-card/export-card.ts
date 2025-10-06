import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ExportFormat {
  value: string;
  label: string;
}

interface ExportPeriod {
  value: string;
  labelKey: string;
  checked: boolean;
}

@Component({
  selector: 'app-export-card',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './export-card.html',
  styleUrl: './export-card.css'
})
export class ExportCard implements OnInit {
  selectedFormat: string = 'PDF';
  email: string = '';
  isDownloading: boolean = false;
  isSending: boolean = false;

  exportFormats: ExportFormat[] = [
    { value: 'PDF', label: 'PDF' },
    { value: 'EXCEL', label: 'Excel' },
    { value: 'CSV', label: 'CSV' }
  ];

  exportPeriods: ExportPeriod[] = [
    { value: 'all', labelKey: 'reports.export.periods.allData', checked: false },
    { value: 'lastMonth', labelKey: 'reports.export.periods.lastMonth', checked: true },
    { value: 'lastWeek', labelKey: 'reports.export.periods.lastWeek', checked: false }
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onFormatChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFormat = target.value;
  }

  onPeriodChange(period: ExportPeriod): void {
    // Uncheck all periods first
    this.exportPeriods.forEach(p => p.checked = false);
    // Check the selected period
    period.checked = true;
  }

  onDownload(): void {
    this.isDownloading = true;
    const selectedPeriod = this.exportPeriods.find(p => p.checked);

    console.log('Downloading report:', {
      format: this.selectedFormat,
      period: selectedPeriod?.value,
      periodLabel: selectedPeriod?.labelKey
    });

    // Simulate download process
    setTimeout(() => {
      const periodLabel = this.translate.instant(selectedPeriod?.labelKey || '');
      const message = this.translate.instant('reports.export.alerts.downloadSuccess', {
        format: this.selectedFormat,
        period: periodLabel
      });
      alert(message);
      this.isDownloading = false;
    }, 2000);
  }

  onSendReport(): void {
    if (!this.email.trim()) {
      const message = this.translate.instant('reports.export.alerts.emailRequired');
      alert(message);
      return;
    }

    this.isSending = true;
    const selectedPeriod = this.exportPeriods.find(p => p.checked);

    console.log('Sending report:', {
      format: this.selectedFormat,
      period: selectedPeriod?.value,
      periodLabel: selectedPeriod?.labelKey,
      email: this.email
    });

    // Simulate send process
    setTimeout(() => {
      const periodLabel = this.translate.instant(selectedPeriod?.labelKey || '');
      const message = this.translate.instant('reports.export.alerts.sendSuccess', {
        format: this.selectedFormat,
        period: periodLabel,
        email: this.email
      });
      alert(message);
      this.isSending = false;
    }, 2000);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email.trim());
  }
}
