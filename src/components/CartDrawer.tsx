import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart, Mail, Loader2 } from 'lucide-react';
import { useCartStore, calculateItemPrice } from '@/hooks/useCart';
import { COMPANY_INFO } from '@/lib/index';
import { SiTelegram } from 'react-icons/si';
import { toast } from 'sonner';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buildTelegramMessage = () => {
    if (items.length === 0) return COMPANY_INFO.telegram;
    
    // Attempt to get the current base URL for absolute image links
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const list = items
      .map((i) => {
        const itemPrice = calculateItemPrice(i.product);
        const subtotal = itemPrice * i.quantity;
        const imgUrl = i.product.images[0].startsWith('http') 
          ? i.product.images[0] 
          : `${baseUrl}${i.product.images[0]}`;
        
        return `- ${i.product.name}\n  Цена: ${i.product.price} ${i.product.priceUnit}\n  Кол-во: ${i.quantity} шт.\n  Сумма: ${subtotal.toLocaleString()} ₽\n  Фото: ${imgUrl}`;
      })
      .join('\n\n');

    let contactInfo = '';
    if (customerName || customerPhone || customerEmail) {
      contactInfo = `\n\nДанные заказчика:\n` +
        (customerName ? `Имя: ${customerName}\n` : '') +
        (customerPhone ? `Телефон: ${customerPhone}\n` : '') +
        (customerEmail ? `Email: ${customerEmail}\n` : '');
    }

    const total = totalPrice();
    const msg = encodeURIComponent(
      `🛒 *Новый заказ из магазина «Форум»*\n\n` +
      `${list}\n\n` +
      `💰 *ИТОГО К ОПЛАТЕ: ${total.toLocaleString()} ₽*` +
      contactInfo +
      `\n\nПрошу связаться со мной для уточнения деталей заказа.`
    );
    
    return `${COMPANY_INFO.telegram}?text=${msg}`;
  };

  const handleOrderSubmit = async () => {
    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    if (!customerName || !customerPhone || !customerEmail) {
      toast.error('Пожалуйста, заполните все контактные данные');
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const orderDetails = items.map((i) => {
        const itemPrice = calculateItemPrice(i.product);
        const subtotal = itemPrice * i.quantity;
        const imgUrl = i.product.images[0].startsWith('http') 
          ? i.product.images[0] 
          : `${baseUrl}${i.product.images[0]}`;
        
        return {
          name: i.product.name,
          price: itemPrice,
          quantity: i.quantity,
          subtotal: subtotal.toLocaleString(),
          imgUrl
        };
      });

      const html = `
        <h2>Новый заказ из магазина «Форум»</h2>
        <p><strong>Заказчик:</strong> ${customerName}</p>
        <p><strong>Телефон:</strong> ${customerPhone}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <hr />
        <h3>Товары:</h3>
        <ul style="list-style: none; padding: 0;">
          ${orderDetails.map((item) => `
            <li style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="${item.imgUrl}" alt="${item.name}" width="60" height="60" style="object-fit: cover; border-radius: 6px; margin-right: 15px;" />
              <div>
                <strong>${item.name}</strong><br/>
                ${item.quantity} шт. × ${item.price} ₽ = <strong>${item.subtotal} ₽</strong>
              </div>
            </li>
          `).join('')}
        </ul>
        <hr />
        <p><strong>ИТОГО К ОПЛАТЕ:</strong> ${totalPrice().toLocaleString()} ₽</p>
      `;

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Forum <onboarding@resend.dev>', // Vérifiez ce domaine sur Resend
          to: [customerEmail, COMPANY_INFO.email],
          subject: `Новый заказ с сайта - ${customerName}`,
          html: html
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Ошибка API Resend');
      }
      
      toast.success('Ваш заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.');
      clearCart();
      onClose();
    } catch (err: any) {
      console.error('Ошибка отправки заказа:', err);
      toast.error('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или напишите в Telegram.');
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="flex items-center gap-3">
                <img src="/favicon.png" alt="Форум" className="h-6 w-auto" />
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
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    Перейти в каталог
                  </button>
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
                        <div className="flex flex-col mt-0.5">
                          {item.product.price && (
                            <span className="text-xs text-muted-foreground">
                              {item.product.price} {item.product.priceUnit}
                            </span>
                          )}
                          <span className="text-sm font-bold text-primary">
                            {(calculateItemPrice(item.product) * item.quantity).toLocaleString()} ₽
                          </span>
                        </div>
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
              <div className="p-4 border-t border-border space-y-4 bg-background">
                <div className="flex items-center justify-between shadow-sm pb-2 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Итого:</span>
                  <span className="text-xl font-bold text-primary">
                    {totalPrice().toLocaleString()} ₽
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ваши контактные данные</p>
                  <input
                    type="text"
                    placeholder="Ваше Имя"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Ваш Телефон"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Ваш Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-secondary/50 focus:bg-background focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting}
                    className="flex flex-col items-center justify-center gap-1.5 w-full px-2 py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-white text-xs font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Mail size={16} />
                    )}
                    <span>{isSubmitting ? 'Отправка...' : 'Заказать по Email'}</span>
                  </button>
                  <a
                    href={buildTelegramMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 w-full px-2 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                  >
                    <SiTelegram size={16} />
                    <span>Заказать в Telegram</span>
                  </a>
                </div>
                <button
                  onClick={clearCart}
                  className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors text-center pt-1"
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
