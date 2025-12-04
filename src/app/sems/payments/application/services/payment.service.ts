import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { PaymentResource, CreatePaymentIntentResponse, ConfirmPaymentResponse } from '../../infrastructure/resources/payment.resource';
import { PaymentIntent, PaymentHistory } from '../../domain/model/entities/payment.entity';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly paymentResource = inject(PaymentResource);

  createPaymentIntent(amount: number, currency: string, userId: string): Observable<PaymentIntent> {
    return this.paymentResource.createPaymentIntent({ amount, currency, userId }).pipe(
      map((response: CreatePaymentIntentResponse) => ({
        clientSecret: response.clientSecret,
        paymentIntentId: response.paymentIntentId,
        amount: response.amount,
        currency: response.currency
      })),
      catchError(error => {
        console.error('Error creating payment intent:', error);
        throw error;
      })
    );
  }

  confirmPayment(paymentIntentId: string, userId: string, amount: number, currency: string): Observable<ConfirmPaymentResponse> {
    return this.paymentResource.confirmPayment({ paymentIntentId, userId, amount, currency }).pipe(
      catchError(error => {
        console.error('Error confirming payment:', error);
        throw error;
      })
    );
  }

  getPaymentHistory(userId: string): Observable<PaymentHistory[]> {
    return this.paymentResource.getPaymentHistory(userId).pipe(
      map(history => history.map(item => ({
        id: item.id,
        userId: item.userId,
        amount: item.amount,
        currency: item.currency,
        status: item.status as PaymentHistory['status'],
        paymentMethod: item.paymentMethod,
        createdAt: new Date(item.createdAt)
      }))),
      catchError(error => {
        console.error('Error fetching payment history:', error);
        return of([]);
      })
    );
  }
}
