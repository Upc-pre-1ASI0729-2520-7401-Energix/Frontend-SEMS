import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../../application/services/report.service';

interface WeeklyData {
  day: string;
  consumption: number;
  label: string;
  date?: string;
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
      this.loadWeeklyData();
    }, 100);
  }

  loadWeeklyData(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    
    console.log('🔄 Cargando datos semanales...');
    
    this.reportService.getWeeklyConsumption().subscribe({
      next: (data) => {
        console.log('✅ Datos semanales recibidos:', data);
        
        if (!data || !data.dailyConsumptions) {
          console.warn('⚠️ Estructura de datos inesperada:', data);
          this.initializeEmptyWeeklyData();
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        
        this.weeklyData = data.dailyConsumptions.map((daily: any) => ({
          day: this.getDayAbbreviation(daily.dayName),
          consumption: daily.consumption,
          label: daily.dayName,
          date: daily.date
        }));
        
        console.log('📊 Datos procesados:', this.weeklyData);
        
        // Calcular el promedio real basado en los datos actuales
        this.calculateMetrics();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error cargando datos semanales:', error);
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
          errorMessage = 'No se encontraron datos para este usuario.';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión. Verifique su conexión a internet.';
        }
        
        this.initializeEmptyWeeklyData();
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = `Error ${error.status}: ${errorMessage}`;
        this.cdr.detectChanges();
      }
    });
  }

  private getDayAbbreviation(dayName: string): string {
    const dayAbbreviations: { [key: string]: string } = {
      'lunes': 'MON',
      'martes': 'TUE', 
      'miércoles': 'WED',
      'jueves': 'THU',
      'viernes': 'FRI',
      'sábado': 'SAT',
      'domingo': 'SUN',
      'Monday': 'MON',
      'Tuesday': 'TUE',
      'Wednesday': 'WED',
      'Thursday': 'THU',
      'Friday': 'FRI',
      'Saturday': 'SAT',
      'Sunday': 'SUN'
    };
    return dayAbbreviations[dayName] || dayName.substring(0, 3).toUpperCase();
  }

  private getDayLabel(day: string): string {
    const dayLabels: { [key: string]: string } = {
      'MON': 'Monday',
      'TUE': 'Tuesday',
      'WED': 'Wednesday',
      'THU': 'Thursday',
      'FRI': 'Friday',
      'SAT': 'Saturday',
      'SUN': 'Sunday'
    };
    return dayLabels[day] || day;
  }

  private calculateMetrics(): void {
    if (this.weeklyData.length === 0) {
      this.weeklyAverage = 0;
      this.maxConsumption = 0;
      return;
    }
    
    // Calcular el promedio real de los datos
    const totalConsumption = this.weeklyData.reduce((sum, day) => sum + day.consumption, 0);
    this.weeklyAverage = totalConsumption / this.weeklyData.length;
    
    // Encontrar el máximo consumo para el escalado
    this.maxConsumption = Math.max(...this.weeklyData.map(day => day.consumption));
    
    // Asegurar que maxConsumption no sea menor que weeklyAverage para posicionamiento correcto
    if (this.maxConsumption < this.weeklyAverage) {
      this.maxConsumption = this.weeklyAverage * 1.2; // Dar un poco de espacio extra
    }
    
    console.log('Weekly metrics calculated:', {
      weeklyAverage: this.weeklyAverage,
      maxConsumption: this.maxConsumption,
      totalConsumption: totalConsumption,
      dataLength: this.weeklyData.length,
      linePosition: this.getAverageLinePosition()
    });
  }

  private initializeEmptyWeeklyData(): void {
    // Mostrar los días de la semana pero sin datos de consumo
    this.weeklyData = [
      { day: 'MON', consumption: 1, label: 'Monday' },
      { day: 'TUE', consumption: 1, label: 'Tuesday' },
      { day: 'WED', consumption: 1, label: 'Wednesday' },
      { day: 'THU', consumption: 1, label: 'Thursday' },
      { day: 'FRI', consumption: 1, label: 'Friday' },
      { day: 'SAT', consumption: 1, label: 'Saturday' },
      { day: 'SUN', consumption: 1, label: 'Sunday' }
    ];
    this.weeklyAverage = 0;
    this.maxConsumption = 100; // Valor alto para hacer barras muy pequeñas
  }

  getBarHeight(consumption: number): number {
    const height = (consumption / this.maxConsumption) * 100;
    // Asegurar altura mínima para detectar hover
    return Math.max(height, 10);
  }

  getAverageLinePosition(): number {
    return (this.weeklyAverage / this.maxConsumption) * 100;
  }

  formatTooltip(data: WeeklyData): string {
    return `${data.label}: ${data.consumption} kWh`;
  }
}
