import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, CheckCircle, Star } from 'lucide-react';
import { Product } from '@/lib/index';
import { useCartStore } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export default function ProductCard({ product, onView }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgba(139,69,19,0.18)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer group"
      onClick={() => onView(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent text-accent-foreground text-xs">
              <Star size={10} className="mr-1" /> Популярное
            </Badge>
          </div>
        )}
        {product.inStock && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-green-500/90 text-white text-xs rounded-full font-medium">
              В наличии
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-4 py-2 bg-card/90 rounded-full shadow-lg">
            <Eye size={16} className="text-primary" />
            <span className="text-sm font-medium">Подробнее</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Specs preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
            <span key={key} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-md">
              {val}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            {product.price ? (
              <>
                <span className="font-bold text-primary text-base">{product.price}</span>
                <span className="text-muted-foreground text-xs ml-1">{product.priceUnit}</span>
              </>
            ) : (
              <span className="text-primary text-sm font-semibold">Цена по запросу</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              added
                ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                : 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {added ? (
              <><CheckCircle size={13} /> Добавлено</>
            ) : (
              <><ShoppingCart size={13} /> В корзину</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
