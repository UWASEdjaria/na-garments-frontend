'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
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

export default function useCustomOrderForm() {
  const [formData, setFormData] =
    useState<CustomOrderFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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