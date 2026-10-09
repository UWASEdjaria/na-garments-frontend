export type CustomOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type CustomOrderPaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface AdminCustomOrder {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string;
  garmentType: string;
  quantity: number;
  measurements: string | null;
  description: string;
  additionalReqs: string | null;
  referenceImageUrls: string[];
  status: CustomOrderStatus;
  paymentStatus: CustomOrderPaymentStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomOrderStatusData {
  status: CustomOrderStatus;
  adminNotes?: string;
}