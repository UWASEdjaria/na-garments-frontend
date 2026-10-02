import { useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlist.service';

export const useWishlistCount = (): number => {
  const [count, setCount] = useState<number>(0);

  const fetchWishlistCount = useCallback(async () => {
    try {
      const response = await wishlistService.getWishlist();
      if (response?.data && Array.isArray(response.data)) {
        setCount(response.data.length);
      } else {
        setCount(0);
      }
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    fetchWishlistCount();

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlist_updated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlist_updated', handleWishlistUpdate);
    };
  }, [fetchWishlistCount]);

  return count;
};