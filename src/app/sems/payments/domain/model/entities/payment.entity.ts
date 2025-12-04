export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  createdAt: Date;
}
