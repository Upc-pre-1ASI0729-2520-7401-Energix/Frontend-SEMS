import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentService } from '../../../application/services/payment.service';
import { DashboardService } from '../../../../energy-management/application/services/dashboard.service';
import { StripePaymentElementComponent } from '../stripe-payment-element/stripe-payment-element';
import { PaymentIntent } from '../../../domain/model/entities/payment.entity';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, StripePaymentElementComponent],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css'
})
export class PaymentFormComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly dashboardService = inject(DashboardService);

  amount: number = 0;
  currency: string = 'pen';
  currencies = [
    { value: 'pen', label: 'PEN (S/.)' },
    { value: 'usd', label: 'USD ($)' },
    { value: 'eur', label: 'EUR (€)' }
  ];

  isLoading = false;
  showStripeForm = false;
  paymentIntentData: PaymentIntent | null = null;
  errorMessage = '';
  successMessage = '';
  estimatedBill = 0;

  ngOnInit(): void {
    this.loadEstimatedBill();
  }

  private loadEstimatedBill(): void {
    this.dashboardService.loadDashboardStats().subscribe({
      next: (stats) => {
        this.estimatedBill = stats.estimatedBill || 0;
        this.amount = this.estimatedBill;
      },
      error: (error) => {
        console.error('Error loading estimated bill:', error);
        this.estimatedBill = 0;
      }
    });
  }

  generatePaymentIntent(): void {
    if (this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userId = localStorage.getItem('userId') || 'guest';
    const amountInCents = Math.round(this.amount * 100);

    this.paymentService.createPaymentIntent(amountInCents, this.currency, userId).subscribe({
      next: (intent) => {
        this.paymentIntentData = intent;
        this.isLoading = false;
        this.successMessage = 'Payment link generated successfully!';
      },
      error: (error) => {
        console.error('Error creating payment intent:', error);
        this.errorMessage = 'Failed to generate payment link. Please try again.';
        this.isLoading = false;
      }
    });
  }

  proceedToPayment(): void {
    if (this.paymentIntentData) {
      this.showStripeForm = true;
    }
  }

  onPaymentSuccess(paymentIntent: any): void {
    console.log('Payment successful:', paymentIntent);
    this.showStripeForm = false;

    const userId = localStorage.getItem('userId') || 'guest';

    this.paymentService.confirmPayment(
      paymentIntent.id,
      userId,
      this.paymentIntentData!.amount,
      this.paymentIntentData!.currency
    ).subscribe({
      next: (response) => {
        this.successMessage = 'Payment completed successfully!';
        this.paymentIntentData = null;
      },
      error: (error) => {
        console.error('Error confirming payment:', error);
        this.successMessage = 'Payment processed. Confirmation pending.';
        this.paymentIntentData = null;
      }
    });
  }

  onPaymentError(error: any): void {
    console.error('Payment error:', error);
    this.errorMessage = error.message || 'Payment failed. Please try again.';
  }

  onPaymentCancel(): void {
    this.showStripeForm = false;
  }

  getFormattedAmount(): string {
    const currencySymbols: { [key: string]: string } = {
      pen: 'S/.',
      usd: '$',
      eur: '€'
    };
    return `${currencySymbols[this.currency]} ${this.amount.toFixed(2)}`;
  }
}
