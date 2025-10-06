import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface DeviceData {
  nameKey: string;
  consumption: number;
  color: string;
  percentage: number;
}

@Component({
  selector: 'app-device-chart',
  imports: [CommonModule, TranslateModule],
  templateUrl: './device-chart.html',
  styleUrl: './device-chart.css'
})
export class DeviceChart implements OnInit {
  devices: DeviceData[] = [];
  maxConsumption: number = 0;
  totalConsumption: number = 0;
  topThreePercentage: number = 55;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.initializeDeviceData();
    this.calculateMetrics();
  }

  private initializeDeviceData(): void {
    // Datos basados en la imagen del ranking de dispositivos
    this.devices = [
      { 
        nameKey: 'reports.deviceChart.devices.airConditioning', 
        consumption: 55, 
        color: '#2C3E50',
        percentage: 0
      },
      { 
        nameKey: 'reports.deviceChart.devices.refrigerator', 
        consumption: 25, 
        color: '#3498DB',
        percentage: 0
      },
      { 
        nameKey: 'reports.deviceChart.devices.desktopPC', 
        consumption: 15, 
        color: '#5DADE2',
        percentage: 0
      }
    ];
  }

  private calculateMetrics(): void {
    this.totalConsumption = this.devices.reduce((sum, device) => sum + device.consumption, 0);
    this.maxConsumption = Math.max(...this.devices.map(device => device.consumption));
    
    // Calcular porcentajes
    this.devices.forEach(device => {
      device.percentage = (device.consumption / this.totalConsumption) * 100;
    });

    // Ordenar por consumo descendente
    this.devices.sort((a, b) => b.consumption - a.consumption);
  }

  getBarWidth(consumption: number): number {
    return (consumption / this.maxConsumption) * 100;
  }

  formatConsumption(consumption: number): string {
    return `${consumption} kWh`;
  }

  getXAxisLabels(): number[] {
    return [0, 10, 20, 30, 40, 50, 60];
  }
}
