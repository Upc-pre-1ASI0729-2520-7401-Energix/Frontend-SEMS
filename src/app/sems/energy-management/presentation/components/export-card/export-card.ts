import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ExportFormat {
  value: string;
  label: string;
}

interface ExportPeriod {
  value: string;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-export-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './export-card.html',
  styleUrl: './export-card.css'
})
export class ExportCard implements OnInit {
  selectedFormat: string = 'PDF';
  email: string = 'macmarco@gmail.com';
  isLoading: boolean = false;

  exportFormats: ExportFormat[] = [
    { value: 'PDF', label: 'PDF' },
    { value: 'EXCEL', label: 'Excel' },
    { value: 'CSV', label: 'CSV' }
  ];

  exportPeriods: ExportPeriod[] = [
    { value: 'all', label: 'All Data', checked: false },
    { value: 'lastMonth', label: 'Last Month', checked: true },
    { value: 'lastWeek', label: 'Last Week', checked: false }
  ];

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
    this.isLoading = true;
    const selectedPeriod = this.exportPeriods.find(p => p.checked);
    
    console.log('Downloading report:', {
      format: this.selectedFormat,
      period: selectedPeriod?.value,
      periodLabel: selectedPeriod?.label
    });

    // Simulate download process
    setTimeout(() => {
      this.isLoading = false;
      alert(`${this.selectedFormat} report for ${selectedPeriod?.label} downloaded successfully!`);
    }, 2000);
  }

  onSendReport(): void {
    if (!this.email.trim()) {
      alert('Please enter a valid email address');
      return;
    }

    this.isLoading = true;
    const selectedPeriod = this.exportPeriods.find(p => p.checked);
    
    console.log('Sending report:', {
      format: this.selectedFormat,
      period: selectedPeriod?.value,
      periodLabel: selectedPeriod?.label,
      email: this.email
    });

    // Simulate send process
    setTimeout(() => {
      this.isLoading = false;
      alert(`${this.selectedFormat} report for ${selectedPeriod?.label} sent to ${this.email} successfully!`);
    }, 2000);
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email.trim());
  }
}
