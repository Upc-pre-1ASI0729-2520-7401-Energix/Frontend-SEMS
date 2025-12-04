import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StripeService } from '../../../infrastructure/services/stripe.service';
import { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-payment-element',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stripe-payment-element.html',
  styleUrl: './stripe-payment-element.css'
})
export class StripePaymentElementComponent implements AfterViewInit, OnDestroy {
  @Input() clientSecret!: string;
  @Input() amount!: number;
  @Input() currency!: string;

  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentError = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('paymentElement') paymentElementRef!: ElementRef;

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;

  isLoading = true;
  isProcessing = false;
  errorMessage = '';

  private readonly stripeService = inject(StripeService);
  private readonly cdr = inject(ChangeDetectorRef);

  async ngAfterViewInit(): Promise<void> {
    await this.initializeStripe();
  }

  ngOnDestroy(): void {
    if (this.paymentElement) {
      this.paymentElement.destroy();
    }
  }

  private async initializeStripe(): Promise<void> {
    try {
      const result = await this.stripeService.createPaymentElement(this.clientSecret);
      if (!result) {
        this.errorMessage = 'Failed to initialize payment form';
        this.isLoading = false;
        this.cdr.detectChanges();
        return;
      }

      this.stripe = result.stripe;
      this.elements = result.elements;
      this.paymentElement = result.paymentElement;

      this.paymentElement.mount(this.paymentElementRef.nativeElement);
      this.paymentElement.on('ready', () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });

      this.paymentElement.on('change', (event: any) => {
        if (event.error) {
          this.errorMessage = event.error.message;
        } else {
          this.errorMessage = '';
        }
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.errorMessage = 'Error loading payment form';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async submitPayment(): Promise<void> {
    if (!this.stripe || !this.elements) {
      this.errorMessage = 'Payment form not ready';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const { error, paymentIntent } = await this.stripeService.confirmPayment(
        this.stripe,
        this.elements,
        window.location.origin + '/payments/success'
      );

      if (error) {
        this.errorMessage = error.message || 'Payment failed';
        this.paymentError.emit(error);
      } else if (paymentIntent) {
        this.paymentSuccess.emit(paymentIntent);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.errorMessage = error.message || 'An unexpected error occurred';
      this.paymentError.emit(error);
    } finally {
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getFormattedAmount(): string {
    const formatted = (this.amount / 100).toFixed(2);
    const currencySymbols: { [key: string]: string } = {
      pen: 'S/.',
      usd: '$',
      eur: '€'
    };
    return `${currencySymbols[this.currency.toLowerCase()] || ''} ${formatted}`;
  }
}
