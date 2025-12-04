// Response de la API - puede devolver claves en inglés o español
export interface DevicePreferenceResponse {
  id: number;
  userId: string;
  preferences: any; // Flexible para aceptar ambos formatos
  lastUpdated: string;
}

// Request esperado por la API: claves en español
export interface DevicePreferenceRequest {
  userId?: string;
  preferences: {
    habilitarMonitoreoEnergia: boolean;
    recibirAlertasAltoConsumo: boolean;
    monitorearCalefaccionRefrigeracion: boolean;
    monitorearElectrodomesticosPrincipales: boolean;
    monitorearElectronicos: boolean;
    monitorearDispositivosCocina: boolean;
    incluirIluminacionExterior: boolean;
    rastrearEnergiaEspera: boolean;
    emailsResumenDiario: boolean;
    reportesProgresoSemanal: boolean;
    sugerirAutomatizacionesAhorro: boolean;
    alertasDispositivosDesconectados: boolean;
  };
}

