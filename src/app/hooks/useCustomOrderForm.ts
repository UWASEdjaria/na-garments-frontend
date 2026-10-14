'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CustomOrderFormData } from '@/app/types/custom-order';
import { customOrderService } from '@/app/services/customOrder.service';

const initialFormData: CustomOrderFormData = {
  name: '',
  email: '',
  phone: '',
  garmentType: '',
  quantity: '1',
  measurements: '',
  description: '',
  additionalReqs: '',
  referenceImageUrls: [],
};

export default function useCustomOrderForm(initialProductId?: string, initialGarmentType?: string) {
  const [formData, setFormData] = useState<CustomOrderFormData>({
    ...initialFormData,
    ...(initialProductId ? { productId: initialProductId } : {}),
    ...(initialGarmentType ? { garmentType: initialGarmentType } : {}),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleTextareaChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    referenceImageUrls: string[] = []
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await customOrderService.create({
        ...formData,
        referenceImageUrls,
      });

      setSuccessMessage(
        'Your custom order request has been submitted successfully.'
      );

      setFormData(initialFormData);
    } catch (error) {
      console.error('Failed to submit custom order:', error);

      setErrorMessage(
        'Something went wrong while submitting your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    successMessage,
    errorMessage,
    handleInputChange,
    handleTextareaChange,
    handleSubmit,
  };
}