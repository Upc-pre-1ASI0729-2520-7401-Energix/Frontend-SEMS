import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-settings-suports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './settings-suports.html',
  styleUrl: './settings-suports.css'
})
export class SettingsSuports {
  showFaqModal = false;
  showHelpModal = false;
  showTutorialsModal = false;

  faqs: FAQ[] = [
    {
      question: '¿Cómo puedo reducir mi consumo energético?',
      answer: 'Puedes activar el modo de ahorro automático, configurar horarios para tus dispositivos y revisar regularmente tus reportes de consumo.'
    },
    {
      question: '¿Qué significan las notificaciones de alto consumo?',
      answer: 'Estas notificaciones te alertan cuando tu consumo supera el promedio habitual, ayudándote a identificar posibles problemas o desperdicios.'
    },
    {
      question: '¿Cómo funcionan los reportes automáticos?',
      answer: 'Los reportes se generan según la frecuencia que elijas y se envían a tu correo en el formato seleccionado.'
    }
  ];

  contactInfo = {
    email: 'soporte@energysems.com',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1555987654',
    socials: {
      facebook: 'https://facebook.com/energysems',
      twitter: 'https://twitter.com/energysems',
      instagram: 'https://instagram.com/energysems',
      linkedin: 'https://linkedin.com/company/energysems'
    }
  };

  helpMessage = '';

  constructor(private snackBar: MatSnackBar) {}

  openFaqModal(): void {
    this.showFaqModal = true;
  }

  closeFaqModal(): void {
    this.showFaqModal = false;
  }

  openHelpModal(): void {
    this.showHelpModal = true;
  }

  closeHelpModal(): void {
    this.showHelpModal = false;
    this.helpMessage = '';
  }

  openTutorialsModal(): void {
    this.showTutorialsModal = true;
  }

  closeTutorialsModal(): void {
    this.showTutorialsModal = false;
  }

  sendHelpMessage(): void {
    if (!this.helpMessage.trim()) {
      this.snackBar.open('Por favor escribe un mensaje', '✖', { duration: 3000 });
      return;
    }

    this.snackBar.open('Mensaje enviado correctamente. Te responderemos pronto.', '✖', { duration: 3000 });
    this.closeHelpModal();
  }

  copyToClipboard(text: string, type: string): void {
    navigator.clipboard.writeText(text);
    this.snackBar.open(`${type} copiado al portapapeles`, '✖', { duration: 2000 });
  }

  openWhatsApp(): void {
    window.open(`https://wa.me/${this.contactInfo.whatsapp}`, '_blank');
  }

  closeAllModals(): void {
    this.closeFaqModal();
    this.closeHelpModal();
    this.closeTutorialsModal();
  }
}
