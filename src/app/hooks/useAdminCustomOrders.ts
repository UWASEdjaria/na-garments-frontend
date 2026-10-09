'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminCustomOrderService } from '@/app/services/adminCustomOrder.service';
import {
  AdminCustomOrder,
  CustomOrderStatus,
} from '@/app/types/admin-custom-order';

export default function useAdminCustomOrders() {
  const [orders, setOrders] = useState<AdminCustomOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await adminCustomOrderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch custom orders:', error);
      setErrorMessage('Failed to load custom orders.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = async (
    id: string,
    status: CustomOrderStatus,
    adminNotes?: string
  ) => {
    try {
      const updatedOrder = await adminCustomOrderService.updateStatus(id, {
        status,
        adminNotes,
      });

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === id ? updatedOrder : order
        )
      );

      return updatedOrder;
    } catch (error) {
      console.error('Failed to update custom order:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    errorMessage,
    fetchOrders,
    updateStatus,
  };
}