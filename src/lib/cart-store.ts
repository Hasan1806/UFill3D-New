'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ColorVariant } from '@/types';
import { StoreCurrency } from './currency';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  currency: StoreCurrency;
  
  // Actions
  addItem: (
    product: Product,
    selectedColor: ColorVariant,
    diameter: string,
    weight: string,
    quantity?: number
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  
  // Computed helpers
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      currency: 'INR',

      addItem: (product, selectedColor, diameter, weight, quantity = 1) => {
        const id = `${product.id}-${selectedColor.id}-${diameter}-${weight}`;
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === id);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isDrawerOpen: true };
          }
          const newItem: CartItem = {
            id,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            material: product.material,
            color: selectedColor,
            diameter,
            weight,
            price: product.price,
            quantity,
            image: product.images[0] || '',
          };
          return { items: [...state.items, newItem], isDrawerOpen: true };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 60 ? 0 : 8.5; // Base catalogue units; formatted as INR at the UI boundary.
      },

      getTotalPrice: () => {
        return get().getSubtotal() + get().getShippingFee();
      },
    }),
    {
      name: 'ufill3d-cart-storage',
      partialize: (state) => ({ items: state.items, currency: state.currency }),
    }
  )
);
