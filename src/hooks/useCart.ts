import { useState, useCallback } from 'react';
import { CartItem, Product } from '@/lib/index';
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  totalPrice: () => number;
}

export const parsePrice = (priceStr: string | null): number => {

  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;
};

export const getDimensions = (product: Product) => {
  const nameMatch = product.name.match(/(\d+(?:\.\d+)?)[\u00d7xX](\d+(?:\.\d+)?)[\u00d7xX](\d+(?:\.\d+)?)/);
  if (nameMatch) {
    return {
      thickness: parseFloat(nameMatch[1]),
      width: parseFloat(nameMatch[2]),
      length: parseFloat(nameMatch[3]),
    };
  }
  // Try specs
  const s = product.specs;
  const thickness = parseFloat(s['Толщина'] || s['Сечение']?.split('×')[0] || s['Размер']?.split('×')[0] || '0');
  const width = parseFloat(s['Ширина'] || s['Сечение']?.split('×')[1] || s['Размер']?.split('×')[1] || '0');
  const length = parseFloat(s['Длина'] || '6000');
  return { thickness, width, length };
};

export const calculateItemPrice = (product: Product): number => {
  const basePrice = parsePrice(product.price);
  if (basePrice === 0) return 0;

  if (product.priceUnit === '₽/м³') {
    const { thickness, width, length } = getDimensions(product);
    if (!thickness || !width || !length) return basePrice;
    const volumePerPiece = (thickness * width * length) / 1000000000;
    return Math.round(basePrice * volumePerPiece);
  }

  if (product.priceUnit === '₽/м²') {
    const { width, length } = getDimensions(product);
    if (!width || !length) return basePrice;
    const areaPerPiece = (width * length) / 1000000;
    return Math.round(basePrice * areaPerPiece);
  }

  return basePrice;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product: Product, quantity: number = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
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
  totalPrice: () => get().items.reduce((sum, item) => {
    return sum + (calculateItemPrice(item.product) * item.quantity);
  }, 0),
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
