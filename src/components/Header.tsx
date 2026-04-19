import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ShoppingCart, ChevronDown, Mail } from 'lucide-react';
import { SiTelegram } from 'react-icons/si';
import { NAV_ITEMS, COMPANY_INFO } from '@/lib/index';
import { useCartStore, useScrollTo } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import CartDrawer from '@/components/CartDrawer';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const scrollTo = useScrollTo();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    scrollTo(href);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-card/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        {/* Top bar */}
        <div className={`border-b border-border/40 transition-all duration-300 ${scrolled ? 'hidden' : 'block'}`}>
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Оптовые поставки лесоматериалов по всей России с 2004 года</span>
            <div className="flex items-center gap-4">
              <span>{COMPANY_INFO.workHours}</span>
              <div className="flex items-center gap-4 border-l border-border/40 pl-4">
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-center gap-1.5 text-primary font-semibold hover:text-accent transition-colors"
                >
                  <Mail size={12} />
                  {COMPANY_INFO.email}
                </a>
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="flex items-center gap-1.5 text-primary font-semibold hover:text-accent transition-colors"
                >
                  <Phone size={12} />
                  {COMPANY_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNav('hero')}
              className="flex items-center gap-3 group"
            >
              <img 
                src="/images/forum_logo.png" 
                alt="Форум" 
                className="h-12 w-auto object-contain"
              />
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <a
                href={COMPANY_INFO.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <SiTelegram size={16} />
                <span className="hidden xl:inline">Telegram</span>
              </a>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground rounded-full text-xs font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Меню"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-card/98 backdrop-blur-md"
            >
              <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNav(item.href)}
                    className="text-left px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border">
                  <a
                    href={COMPANY_INFO.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg"
                  >
                    <SiTelegram size={16} /> Telegram
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-lg"
                  >
                    <Mail size={16} /> Email
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
