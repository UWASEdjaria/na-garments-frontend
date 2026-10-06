export interface CreateCustomOrderRequest {
  name: string;
  email: string;
  phone: string;
  garmentType: string;
  quantity: number;
  measurements?: string;
  description: string;
  additionalReqs?: string;
  referenceImageUrls?: string[];
}

export interface CustomOrderFormData {
  name: string;
  email: string;
  phone: string;
  garmentType: string;
  quantity: string;
  measurements: string;
  description: string;
  additionalReqs: string;
  referenceImageUrls: string[];
}

export interface CustomOrder {
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
  status: string;
  paymentStatus: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}