import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private readonly publicKey = 'pk_test_51QRGoVP3te7cBLa3F8KLzqQwRXVhvLitkdKdyNPKMYvHDmjlh5ZhBvQEBIPFONzxLF6SBQ50lzkEjJOPwWNDtLIJ00YQ1GRzBM';

  constructor() {
    this.stripePromise = loadStripe(this.publicKey);
  }

  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async createPaymentElement(clientSecret: string): Promise<{
    stripe: Stripe;
    elements: StripeElements;
    paymentElement: StripePaymentElement;
  } | null> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe failed to load');
      return null;
    }

    const elements = stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#1976d2',
          colorBackground: '#ffffff',
          colorText: '#333333',
          colorDanger: '#df1b41',
          fontFamily: 'Roboto, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px'
        }
      }
    });

    const paymentElement = elements.create('payment', {
      layout: 'tabs'
    });

    return { stripe, elements, paymentElement };
  }

  async confirmPayment(
    stripe: Stripe,
    elements: StripeElements,
    returnUrl: string
  ): Promise<{ error?: any; paymentIntent?: any }> {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl
      },
      redirect: 'if_required'
    });

    return { error, paymentIntent };
  }
}
