import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyChart } from '../../components/weekly-chart/weekly-chart';
import { DeviceChart } from '../../components/device-chart/device-chart';
import { ExportCard } from '../../components/export-card/export-card';

interface InsightCard {
  type: 'success' | 'tip';
  title: string;
  message: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    WeeklyChart,
    DeviceChart,
    ExportCard
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  insightCards: InsightCard[] = [];

  ngOnInit(): void {
    this.initializeInsightCards();
  }

  private initializeInsightCards(): void {
    this.insightCards = [
      {
        type: 'success',
        title: 'Great Month!',
        message: 'You reduced your consumption by 12% last month, saving $/25.',
        icon: '🎉',
        color: '#4A90E2'
      },
      {
        type: 'tip',
        title: 'Tip: Change out your lightbulbs!',
        message: 'Switching to LED bulbs can save you about $/300 a year on your electricity bill.',
        icon: '💡',
        color: '#5B9BD5'
      }
    ];
  }
}
