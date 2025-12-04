import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentFormComponent } from '../../components/payment-form/payment-form';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, TranslateModule, PaymentFormComponent],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class PaymentsViewComponent {}
