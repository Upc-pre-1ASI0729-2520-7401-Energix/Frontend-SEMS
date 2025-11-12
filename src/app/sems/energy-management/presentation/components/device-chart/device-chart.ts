import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../../application/services/report.service';
import { DevicesService } from '../../../application/services/devices.service';
import { Device } from '../../../domain/model/device.entity';

interface DeviceData {
  nameKey: string;
  displayName: string;
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
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private translate: TranslateService,
    private reportService: ReportService,
    private devicesService: DevicesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Asegurar que el componente esté completamente inicializado
    setTimeout(() => {
      this.loadDeviceData();
    }, 100);
  }

  loadDeviceData(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.devicesService.getAllDevices().subscribe({
      next: (devices: Device[]) => {
        if (devices.length === 0) {
          this.devices = [];
        } else {
          // Convertir los dispositivos a datos de consumo para la gráfica
          this.devices = devices.map((device, index) => ({
            nameKey: this.getDeviceNameKey(device.name),
            displayName: device.name,
            consumption: this.generateConsumptionForDevice(device, index),
            color: this.getDeviceColor(index),
            percentage: 0 // Se calculará después
          }));
          
          // Ordenar por consumo descendente y tomar solo los 3 mejores
          this.devices.sort((a, b) => b.consumption - a.consumption);
          this.devices = this.devices.slice(0, 3);
          
          this.calculateMetrics();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading device data:', error);
        this.devices = [];
        this.isLoading = false;
        this.hasError = false;
        this.cdr.detectChanges();
      }
    });
  }

  private generateConsumptionForDevice(device: Device, index: number): number {
    // Generar consumo basado en el tipo de dispositivo y su estado
    const baseConsumptions: { [key: string]: number } = {
      'REFRIGERATOR': 120,
      'AIR_CONDITIONER': 100,
      'TV': 45,
      'WASHING_MACHINE': 80,
      'MICROWAVE': 35,
      'LAPTOP': 25,
      'DESKTOP_PC': 60,
      'SMART_SPEAKER': 15,
      'SMART_LAMP': 10
    };
    
    let baseConsumption = baseConsumptions[device.type] || 30;
    
    // Usar el ID del dispositivo para generar una variación consistente
    const deviceIdHash = this.hashString(device.id);
    const variation = 0.8 + (deviceIdHash % 40) / 100; // Variación entre 0.8 y 1.2
    
    // Ajustar según el estado del dispositivo
    if (device.status === 'OFF' || device.status === 'STANDBY') {
      baseConsumption *= 0.1; // Consumo mínimo cuando está apagado
    } else if (device.status === 'ON') {
      baseConsumption *= variation; // Variación determinística
    }
    
    return Math.round(baseConsumption);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getDeviceColor(index: number): string {
    const colors = ['#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5', '#64B5F6'];
    return colors[index % colors.length];
  }

  private getDeviceNameKey(deviceName: string): string {
    const nameKeyMapping: { [key: string]: string } = {
      'Refrigerator': 'reports.deviceChart.devices.refrigerator',
      'Air Conditioner': 'reports.deviceChart.devices.airConditioning',
      'TV': 'reports.deviceChart.devices.tv',
      'Laptop': 'reports.deviceChart.devices.laptop',
      'Smart Speaker': 'reports.deviceChart.devices.smartSpeaker',
      'Microwave': 'reports.deviceChart.devices.microwave'
    };
    return nameKeyMapping[deviceName] || `reports.deviceChart.devices.${deviceName.toLowerCase().replace(' ', '')}`;
  }

  private calculateMetrics(): void {
    if (this.devices.length === 0) {
      this.totalConsumption = 0;
      this.maxConsumption = 0;
      this.topThreePercentage = 0;
      return;
    }
    
    this.totalConsumption = this.devices.reduce((sum, device) => sum + device.consumption, 0);
    this.maxConsumption = Math.max(...this.devices.map(device => device.consumption));
    
    // Calcular porcentajes
    this.devices.forEach(device => {
      device.percentage = this.totalConsumption > 0 ? (device.consumption / this.totalConsumption) * 100 : 0;
    });

    // Como solo tenemos 3 dispositivos, estos representan el 100% del ranking mostrado
    this.topThreePercentage = 100;

    // Mantener el orden por consumo descendente
    this.devices.sort((a, b) => b.consumption - a.consumption);
  }

  getBarWidth(consumption: number): number {
    if (consumption === 0) return 0;
    const percentage = (consumption / this.maxConsumption) * 100;
    // Asegurar un ancho mínimo del 5% para valores muy pequeños
    return Math.max(percentage, 5);
  }

  formatConsumption(consumption: number): string {
    return `${consumption} kWh`;
  }

  getXAxisLabels(): number[] {
    // Generar etiquetas basadas en el consumo máximo real
    const max = Math.ceil(this.maxConsumption / 10) * 10; // Redondear hacia arriba a la decena más cercana
    const step = max / 6; // 6 divisiones
    const labels = [];
    for (let i = 0; i <= 6; i++) {
      labels.push(Math.round(i * step));
    }
    return labels;
  }
}
