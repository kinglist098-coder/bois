import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { Product } from '@/lib/index';
import { useCartStore, useScrollTo } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMPANY_INFO } from '@/lib/index';
import { SiTelegram } from 'react-icons/si';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const scrollTo = useScrollTo();

  if (!product) return null;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleContact = () => {
    onClose();
    setTimeout(() => scrollTo('contact'), 100);
  };


  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-card rounded-full shadow-lg hover:bg-secondary transition-colors"
            >
              <X size={18} />
            </button>

            {/* Images */}
            <div className="md:w-1/2 relative bg-secondary/20">
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                className="w-full h-64 md:h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 rounded-full shadow hover:bg-card transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 rounded-full shadow hover:bg-card transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === imgIdx ? 'bg-primary' : 'bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className="md:w-1/2 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.inStock ? '✓ В наличии' : 'Под заказ'}
                </Badge>
                <img src="/favicon.png" alt="Форум" className="h-6 w-auto opacity-50" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                {product.price ? (
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-primary">{product.price} </span>
                    <span className="text-muted-foreground text-sm">{product.priceUnit}</span>
                  </div>
                ) : (
                  <p className="text-primary font-semibold mt-2">Цена по запросу</p>
                )}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

              {/* Specs */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Технические характеристики</h3>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex flex-col p-2 bg-secondary/40 rounded-lg">
                      <span className="text-xs text-muted-foreground">{key}</span>
                      <span className="text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-auto pt-2">
                <Button
                  onClick={handleAdd}
                  className="w-full"
                  variant={added ? 'secondary' : 'default'}
                >
                  {added ? (
                    <><CheckCircle size={16} className="mr-2 text-green-500" /> Добавлено в корзину</>
                  ) : (
                    <><ShoppingCart size={16} className="mr-2" /> В корзину</>
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleContact}>
                  <MessageCircle size={16} className="mr-2" /> Запросить цену
                </Button>
                  <a
                    href={COMPANY_INFO.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <SiTelegram size={14} /> Telegram
                  </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
