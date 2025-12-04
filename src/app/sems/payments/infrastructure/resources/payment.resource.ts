import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments';

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  userId: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  userId: string;
  amount: number;
  currency: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  paymentId: string;
  message?: string;
}

export interface PaymentHistoryResponse {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentResource {
  private readonly stripeApiUrl = environment.stripeApiUrl;

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(environment.tokenKey);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(
      `${this.stripeApiUrl}/api/payments/create-intent`,
      request,
      { headers: this.getHeaders() }
    );
  }

  confirmPayment(request: ConfirmPaymentRequest): Observable<ConfirmPaymentResponse> {
    return this.http.post<ConfirmPaymentResponse>(
      `${this.stripeApiUrl}/api/payments/confirm`,
      request,
      { headers: this.getHeaders() }
    );
  }

  getPaymentHistory(userId: string): Observable<PaymentHistoryResponse[]> {
    return this.http.get<PaymentHistoryResponse[]>(
      `${this.stripeApiUrl}/api/payments/history/${userId}`,
      { headers: this.getHeaders() }
    );
  }
}
