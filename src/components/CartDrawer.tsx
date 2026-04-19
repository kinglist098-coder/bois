import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCartStore, useScrollTo } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/index';
import { SiTelegram } from 'react-icons/si';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const scrollTo = useScrollTo();

  const handleOrder = () => {
    onClose();
    scrollTo('contact');
  };

  const buildTelegramMessage = () => {
    if (items.length === 0) return COMPANY_INFO.telegram;
    const list = items
      .map((i) => `- ${i.product.name} × ${i.quantity}`)
      .join('\n');
    const msg = encodeURIComponent(`Добрый день! Хочу заказать:\n${list}\n\nПрошу связаться со мной.`);
    return `${COMPANY_INFO.telegram}?text=${msg}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" />
                <h2 className="font-semibold text-lg">Корзина</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    {items.reduce((n, i) => n + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p className="text-sm">Корзина пуста</p>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Перейти в каталог
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 p-3 bg-secondary/30 rounded-lg">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        {item.product.price && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.product.price} {item.product.priceUnit}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-border hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-xs transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-border hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-xs transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors self-start"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <Button className="w-full" onClick={handleOrder}>
                  <MessageCircle size={16} className="mr-2" />
                  Оформить заявку
                </Button>
                <a
                  href={buildTelegramMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <SiTelegram size={16} />
                  Заказать через Telegram
                </a>
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Очистить корзину
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
