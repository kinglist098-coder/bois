import { useState, useCallback } from 'react';
import { CartItem, Product } from '@/lib/index';
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },
  removeItem: (productId: string) => {
    set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
  },
  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

export function useScrollTo() {
  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);
  return scrollToSection;
}

export function useActiveSection(sections: string[]) {
  const [active, setActive] = useState(sections[0] || '');

  const handleScroll = useCallback(() => {
    const offset = 120;
    for (const id of [...sections].reverse()) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= offset) {
        setActive(id);
        return;
      }
    }
    setActive(sections[0] || '');
  }, [sections]);

  return { active, handleScroll };
}
