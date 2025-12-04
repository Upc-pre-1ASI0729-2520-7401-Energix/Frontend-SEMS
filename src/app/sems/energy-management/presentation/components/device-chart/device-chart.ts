import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../../application/services/report.service';

interface DeviceData {
  nameKey: string;
  displayName: string;
  consumption: number;
  color: string;
  percentage: number;
  deviceType?: string;
  deviceCategory?: string;
  deviceId?: number;
  period?: string;
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
    
    console.log('🔄 Cargando datos de dispositivos top...');
    
    this.reportService.getTopDevices().subscribe({
      next: (devices: any[]) => {
        console.log('✅ Datos de dispositivos recibidos:', devices);
        
        if (!Array.isArray(devices)) {
          console.warn('⚠️ Los datos no son un array:', devices);
          this.devices = [];
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        
        if (devices.length === 0) {
          console.log('ℹ️ No hay dispositivos disponibles');
          this.devices = [];
        } else {
          // Convertir los dispositivos del backend a datos para la gráfica
          this.devices = devices.slice(0, 3).map((device, index) => ({
            nameKey: this.getDeviceNameKey(device.deviceName),
            displayName: device.deviceName,
            consumption: device.totalConsumption,
            color: this.getDeviceColor(index),
            percentage: 0, // Se calculará después
            deviceType: device.deviceType,
            deviceCategory: device.deviceCategory,
            deviceId: device.deviceId,
            period: device.period
          }));
          
          console.log('📊 Dispositivos procesados:', this.devices);
          
          this.calculateMetrics();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error cargando datos de dispositivos:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('URL:', error.url);
        
        let errorMessage = 'No se pudieron cargar los datos';
        
        if (error.status === 401) {
          errorMessage = 'Error de autenticación. Por favor, inicie sesión nuevamente.';
          console.error('❌ Error 401: Usuario no autenticado');
        } else if (error.status === 403) {
          errorMessage = 'No tiene permisos para acceder a estos datos.';
        } else if (error.status === 404) {
          errorMessage = 'No se encontraron dispositivos para este usuario.';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión. Verifique su conexión a internet.';
        }
        
        this.devices = [];
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = `Error ${error.status}: ${errorMessage}`;
        this.cdr.detectChanges();
      }
    });
  }

  private getDeviceColor(index: number): string {
    const colors = ['#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5', '#64B5F6'];
    return colors[index % colors.length];
  }

  private getDeviceNameKey(deviceName: string): string {
    const nameKeyMapping: { [key: string]: string } = {
      // English names
      'Refrigerator': 'refrigerator',
      'Air Conditioner': 'airConditioning',
      'TV': 'tv',
      'Laptop': 'laptop',
      'Smart Speaker': 'smartSpeaker',
      'Microwave': 'microwave',
      'Desktop PC': 'desktopPC',
      // Spanish names
      'Refrigerador': 'refrigerator',
      'Aire Acondicionado': 'airConditioning',
      'Televisor': 'tv',
      'Portátil': 'laptop',
      'Altavoz Inteligente': 'smartSpeaker',
      'Microondas': 'microwave',
      'PC de Escritorio': 'desktopPC'
    };
    return nameKeyMapping[deviceName] || deviceName.toLowerCase().replace(/\s+/g, '');
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
    if (consumption === 0 || this.maxConsumption === 0) return 0;
    return (consumption / this.maxConsumption) * 100;
  }

  formatConsumption(consumption: number): string {
    return `${consumption} kWh`;
  }

  getXAxisLabels(): number[] {
    // Si no hay consumo máximo, retornar escala por defecto
    if (this.maxConsumption === 0) {
      return [0, 1, 2, 3, 4, 5];
    }
    
    let maxRounded;
    let step;
    
    // Para valores pequeños (≤ 5), usar incrementos más pequeños
    if (this.maxConsumption <= 5) {
      maxRounded = Math.ceil(this.maxConsumption);
      step = Math.max(maxRounded / 5, 0.2); // Mínimo step de 0.2
    } 
    // Para valores medianos (5-20), usar incrementos de 1
    else if (this.maxConsumption <= 20) {
      maxRounded = Math.ceil(this.maxConsumption / 5) * 5;
      step = maxRounded / 5;
    }
    // Para valores grandes, usar el método original
    else {
      maxRounded = Math.ceil(this.maxConsumption / 10) * 10;
      step = maxRounded / 5;
    }
    
    const labels = [];
    for (let i = 0; i <= 5; i++) {
      const value = i * step;
      // Redondear a 1 decimal para evitar problemas de punto flotante
      labels.push(Math.round(value * 10) / 10);
    }
    return labels;
  }
}
