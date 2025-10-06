import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface WeeklyData {
  day: string;
  consumption: number;
  label: string;
}

@Component({
  selector: 'app-weekly-chart',
  imports: [CommonModule, TranslateModule],
  templateUrl: './weekly-chart.html',
  styleUrl: './weekly-chart.css'
})
export class WeeklyChart implements OnInit {
  weeklyData: WeeklyData[] = [];
  weeklyAverage: number = 0;
  maxConsumption: number = 0;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.initializeWeeklyData();
    this.calculateMetrics();
  }

  private initializeWeeklyData(): void {
    // Datos de ejemplo basados en la imagen
    this.weeklyData = [
      { day: 'MON', consumption: 35, label: 'Monday' },
      { day: 'TUE', consumption: 42, label: 'Tuesday' },
      { day: 'WED', consumption: 48, label: 'Wednesday' },
      { day: 'THU', consumption: 38, label: 'Thursday' },
      { day: 'FRI', consumption: 52, label: 'Friday' },
      { day: 'SAT', consumption: 58, label: 'Saturday' },
      { day: 'SUN', consumption: 62, label: 'Sunday' }
    ];
  }

  private calculateMetrics(): void {
    const totalConsumption = this.weeklyData.reduce((sum, day) => sum + day.consumption, 0);
    this.weeklyAverage = totalConsumption / this.weeklyData.length;
    this.maxConsumption = Math.max(...this.weeklyData.map(day => day.consumption));
  }

  getBarHeight(consumption: number): number {
    return (consumption / this.maxConsumption) * 100;
  }

  getAverageLinePosition(): number {
    return (this.weeklyAverage / this.maxConsumption) * 100;
  }
}
