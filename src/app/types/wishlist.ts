export interface WishlistItemData {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: WishlistItemData[];
}