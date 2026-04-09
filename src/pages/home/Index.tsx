import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, ArrowRight, Phone, MessageCircle, Star, Shield, Truck, Award, Users, TreePine, CheckCircle, MapPin, Mail, Clock, Send, Building2 } from 'lucide-react';
import { SiWhatsapp, SiTelegram, SiVk } from 'react-icons/si';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { COMPANY_INFO } from '@/lib/index';
import { CATEGORIES, PRODUCTS } from '@/data/products';
import { Product } from '@/lib/index';
import { useScrollTo } from '@/hooks/useCart';

// ─── Framer helpers ───────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

// ─── Contact form schema ───────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
  phone: z.string().min(7, 'Введите корректный номер телефона'),
  email: z.string().email('Введите корректный email').or(z.literal('')).optional(),
  message: z.string().min(5, 'Введите сообщение (минимум 5 символов)'),
});
type ContactFormData = z.infer<typeof contactSchema>;

// ─── FadeIn section wrapper ─────────────────────────────────────
function FadeSection({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} id={id || undefined} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-xl hover:border-accent transition-colors">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Icon size={22} className="text-primary" />
      </div>
      <div className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// ─── SERVICE CARD ──────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, description, highlight = false }: { icon: React.ElementType; title: string; description: string; highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      highlight
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-card border-border hover:border-accent/50'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        highlight ? 'bg-white/20' : 'bg-primary/10'
      }`}>
        <Icon size={22} className={highlight ? 'text-primary-foreground' : 'text-primary'} />
      </div>
      <h3 className={`font-semibold text-base mb-2 ${highlight ? 'text-primary-foreground' : 'text-foreground'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formSent, setFormSent] = useState(false);
  const scrollTo = useScrollTo();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.categoryId === selectedCategory);

  const onSubmit = async (_data: ContactFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    setFormSent(true);
    reset();
    setTimeout(() => setFormSent(false), 5000);
  };

  // ─── HERO ──────────────────────────────────────────────────
  return (
    <>
      <Header />

      <main>
        {/* ══════════ HERO ══════════ */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/8233ad1fb78019fd35a0bd0df7a96d97.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/75 via-foreground/60 to-primary/50" />
          {/* Subtle wood texture overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url('/images/fa7df75629cd7978031691361112a8d3.jpg')`,
              backgroundRepeat: 'repeat',
              backgroundSize: '400px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-accent/20 text-accent border-accent/40 text-sm px-4 py-1.5">
                🏆 Надёжный поставщик с 2004 года
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Качественные<br />
              <span className="text-accent">лесоматериалы</span><br />
              оптом в СПб
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              Брус, доска, вагонка, фанера, OSB и клееный брус. Широкий ассортимент, конкурентные цены, быстрая доставка по всей России.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-accent text-primary-foreground px-8 h-12 text-base font-semibold shadow-xl"
                onClick={() => scrollTo('catalog')}
              >
                Смотреть каталог <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 px-8 h-12 text-base"
                onClick={() => scrollTo('contact')}
              >
                <Phone size={18} className="mr-2" /> Получить КП
              </Button>
            </motion.div>

            {/* Messenger buttons */}
            <motion.div
              className="flex justify-center gap-3 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              <a href={COMPANY_INFO.whatsapp} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white text-sm font-medium rounded-full backdrop-blur transition-colors">
                <SiWhatsapp size={16} /> WhatsApp
              </a>
              <a href={COMPANY_INFO.telegram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white text-sm font-medium rounded-full backdrop-blur transition-colors">
                <SiTelegram size={16} /> Telegram
              </a>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors"
            onClick={() => scrollTo('about')}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={32} />
          </motion.button>
        </section>

        {/* ══════════ STATS ══════════ */}
        <section className="py-12 bg-secondary/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {[
                { icon: Award, value: '20+', label: 'лет на рынке' },
                { icon: Users, value: '2 000+', label: 'клиентов' },
                { icon: TreePine, value: '50 000+', label: 'м³ поставлено' },
                { icon: Truck, value: '85', label: 'регионов доставки' },
              ].map((s) => (
                <motion.div key={s.label} variants={fadeUp}>
                  <StatCard {...s} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════ ABOUT ══════════ */}
        <section id="about" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <FadeSection>
                <Badge variant="secondary" className="mb-4">О компании</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  ООО «Форум» — ваш надёжный партнёр в сфере лесоматериалов
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  С 2004 года мы специализируемся на оптовой торговле лесоматериалами и строительными материалами в Санкт-Петербурге и по всей России. За более чем 20 лет работы мы выстроили долгосрочные отношения с ведущими производителями и стали надёжным партнёром для сотен строительных компаний и частных застройщиков.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Мы предлагаем широкий ассортимент пиломатериалов: строительный и клееный брус, обрезные доски, вагонку, фанеру, OSB-плиты, имитацию бруса и многое другое. Вся продукция сертифицирована и соответствует ГОСТ.
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    'Прямые поставки от производителей',
                    'Вся продукция сертифицирована по ГОСТ',
                    'Персональный менеджер для каждого клиента',
                    'Гибкие условия оплаты и доставки',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Button onClick={() => scrollTo('catalog')}>
                    Каталог продукции <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <Button variant="outline" onClick={() => scrollTo('contact')}>
                    Связаться с нами
                  </Button>
                </div>
              </FadeSection>

              {/* Images grid */}
              <FadeSection className="grid grid-cols-2 gap-3">
                <img
                  src="/images/90ebd9d60ff445d5f1ff292446befd7e.jpg"
                  alt="Склад лесоматериалов"
                  className="w-full h-52 object-cover rounded-xl"
                />
                <img
                  src="/images/d977bb6bc3bc799426c792774dd7c200.jpg"
                  alt="Бревна на складе"
                  className="w-full h-52 object-cover rounded-xl mt-6"
                />
                <img
                  src="/images/cb36632a4b0a4bcee9e5a8bf1fe320b3.jpg"
                  alt="Доски сосновые"
                  className="w-full h-52 object-cover rounded-xl"
                />
                <img
                  src="/images/ddb61e35da2c011a63b4cab0fc90ea8b.jpg"
                  alt="Лесной массив"
                  className="w-full h-52 object-cover rounded-xl mt-6"
                />
              </FadeSection>
            </div>

            {/* Legal details */}
            <FadeSection className="mt-12 p-6 bg-secondary/30 rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-primary" />
                <h3 className="font-semibold">Реквизиты компании</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  ['Полное наименование', COMPANY_INFO.fullName],
                  ['ИНН', COMPANY_INFO.inn],
                  ['ОГРН', COMPANY_INFO.ogrn],
                  ['КПП', COMPANY_INFO.kpp],
                  ['ОКПО', COMPANY_INFO.okpo],
                  ['Дата регистрации', COMPANY_INFO.founded],
                  ['Руководитель', COMPANY_INFO.director],
                  ['Юридический адрес', COMPANY_INFO.address],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ══════════ CATALOG ══════════ */}
        <section id="catalog" className="py-20 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4">
            <FadeSection className="text-center mb-10">
              <Badge variant="secondary" className="mb-4">Ассортимент</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Каталог лесоматериалов
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Широкий выбор пиломатериалов и деревянных изделий для строительства и отделки. Оптовые цены от производителя.
              </p>
            </FadeSection>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card border border-border hover:border-primary/50 text-foreground'
                }`}
              >
                Все товары ({PRODUCTS.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card border border-border hover:border-primary/50 text-foreground'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              variants={stagger}
              initial="hidden"
              animate="visible"
              key={selectedCategory}
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <ProductCard
                    product={product}
                    onView={(p) => setSelectedProduct(p)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <FadeSection className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">
                Нужен товар не из списка? Свяжитесь с нами — мы найдём любой материал.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => scrollTo('contact')}>
                  <MessageCircle size={18} className="mr-2" /> Запросить нестандартный товар
                </Button>
                <a href={COMPANY_INFO.whatsapp} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <SiWhatsapp size={18} className="mr-2" /> Написать в WhatsApp
                  </Button>
                </a>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ══════════ SERVICES ══════════ */}
        <section id="services" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <FadeSection className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Наши преимущества</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Почему выбирают нас
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Мы предоставляем комплексный сервис: от подбора материалов до доставки на объект.
              </p>
            </FadeSection>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {[
                {
                  icon: Shield,
                  title: 'Сертифицированная продукция',
                  description: 'Вся продукция сертифицирована по ГОСТ. Предоставляем паспорта качества и сертификаты соответствия на каждую партию.',
                  highlight: false,
                },
                {
                  icon: Truck,
                  title: 'Доставка по России',
                  description: 'Организуем доставку во все 85 регионов России. Автотранспорт, ЖД и морские перевозки. Сроки от 1 дня по СПб.',
                  highlight: true,
                },
                {
                  icon: Award,
                  title: '20+ лет опыта',
                  description: 'С 2004 года на рынке. Знаем все нюансы оптовой торговли лесоматериалами и строительными материалами.',
                  highlight: false,
                },
                {
                  icon: Users,
                  title: 'Персональный менеджер',
                  description: 'За каждым клиентом закреплён личный менеджер. Ответим на вопросы и поможем с подбором материалов.',
                  highlight: false,
                },
                {
                  icon: Star,
                  title: 'Гибкие условия оплаты',
                  description: 'Оплата по факту, отсрочка для постоянных клиентов. Безналичный расчёт, электронный документооборот.',
                  highlight: false,
                },
                {
                  icon: TreePine,
                  title: 'Экологичный выбор',
                  description: 'Сотрудничаем только с производителями, ведущими легальную заготовку. Вся древесина из сертифицированных лесов.',
                  highlight: false,
                },
              ].map((service) => (
                <motion.div key={service.title} variants={fadeUp}>
                  <ServiceCard {...service} />
                </motion.div>
              ))}
            </motion.div>

            {/* Delivery info */}
            <FadeSection className="mt-12 p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl border border-primary/20">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Truck size={18} className="text-primary" /> Доставка по СПб
                  </h3>
                  <p className="text-sm text-muted-foreground">От 1 рабочего дня. Собственный автопарк. Погрузочно-разгрузочные работы.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Truck size={18} className="text-primary" /> Доставка по России
                  </h3>
                  <p className="text-sm text-muted-foreground">3–14 дней. ЖД, автотранспорт и транспортные компании на выбор клиента.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle size={18} className="text-primary" /> Самовывоз
                  </h3>
                  <p className="text-sm text-muted-foreground">Самовывоз со склада в Санкт-Петербурге. Удобный график, быстрая отгрузка.</p>
                </div>
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ══════════ CONTACT ══════════ */}
        <section id="contact" className="py-20 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4">
            <FadeSection className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Обратная связь</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Свяжитесь с нами
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Оставьте заявку и мы свяжемся с вами в течение 15 минут в рабочее время.
              </p>
            </FadeSection>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Contact info */}
              <div className="lg:col-span-2 space-y-5">
                {/* Messenger CTA */}
                <div className="p-5 bg-card border border-border rounded-xl">
                  <h3 className="font-semibold mb-3">Быстрая связь</h3>
                  <div className="flex flex-col gap-2">
                    <a
                      href={COMPANY_INFO.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <SiWhatsapp size={22} className="text-green-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-green-800">WhatsApp</div>
                        <div className="text-xs text-green-600">Написать в WhatsApp</div>
                      </div>
                    </a>
                    <a
                      href={COMPANY_INFO.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <SiTelegram size={22} className="text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">Telegram</div>
                        <div className="text-xs text-blue-600">Написать в Telegram</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Contact details */}
                <div className="p-5 bg-card border border-border rounded-xl space-y-4">
                  <h3 className="font-semibold">Контактная информация</h3>
                  {[
                    { icon: MapPin, label: 'Адрес офиса', value: COMPANY_INFO.shortAddress },
                    { icon: Phone, label: 'Телефон', value: COMPANY_INFO.phone, href: `tel:${COMPANY_INFO.phone}` },
                    { icon: Mail, label: 'Email', value: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
                    { icon: Clock, label: 'Режим работы', value: COMPANY_INFO.workHours },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={14} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{label}</div>
                        {href ? (
                          <a href={href} className="text-sm font-medium hover:text-primary transition-colors">{value}</a>
                        ) : (
                          <div className="text-sm font-medium">{value}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Bases list */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Наши склады в СПб</h4>
                    <div className="space-y-3">
                      {(COMPANY_INFO as any).bases.map((base: string) => (
                        <div key={base} className="flex items-start gap-3">
                          <MapPin size={14} className="text-primary mt-1 flex-shrink-0" />
                          <span className="text-xs font-medium">{base}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="p-5 bg-card border border-border rounded-xl">
                  <h3 className="font-semibold mb-3">Мы в соцсетях</h3>
                  <div className="flex gap-2">
                    <a href={COMPANY_INFO.vk} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <SiVk size={16} /> ВКонтакте
                    </a>
                    <a href={COMPANY_INFO.telegram} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-sky-500 text-white text-xs font-medium rounded-lg hover:bg-sky-600 transition-colors">
                      <SiTelegram size={16} /> Telegram
                    </a>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-3">
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h3 className="font-semibold text-lg mb-6">Оставить заявку</h3>

                  {formSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h4 className="font-semibold text-xl">Заявка отправлена!</h4>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        Спасибо! Наш менеджер свяжется с вами в течение 15 минут в рабочее время.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="name">Имя *</Label>
                          <Input
                            id="name"
                            placeholder="Иван Иванов"
                            {...register('name')}
                            className={errors.name ? 'border-destructive' : ''}
                          />
                          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone">Телефон *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 (812) 000-00-00"
                            {...register('phone')}
                            className={errors.phone ? 'border-destructive' : ''}
                          />
                          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email (необязательно)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@mail.ru"
                          {...register('email')}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message">Сообщение или описание заявки *</Label>
                        <Textarea
                          id="message"
                          placeholder="Опишите, что вас интересует: вид материала, объём, сроки доставки..."
                          rows={5}
                          {...register('message')}
                          className={errors.message ? 'border-destructive' : ''}
                        />
                        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Нажимая «Отправить заявку», вы соглашаетесь с обработкой персональных данных в соответствии с политикой конфиденциальности.
                      </p>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          'Отправка...'
                        ) : (
                          <><Send size={18} className="mr-2" /> Отправить заявку</>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <FadeSection className="mt-8 rounded-xl overflow-hidden border border-border h-72">
              <iframe
                title="Карта офиса ООО Форум Санкт-Петербург"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.0!2d30.408!3d59.994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4696378e8c5a6a8f%3A0x9dab4d80e3fc0b59!2z0JPRgNCw0LbQtNCw0L3RgdC60LjQuSDQv9GALdGCLCAyNiwg0KHQsNC90LrRgi3QnyDQv9C10YLQtdGA0LHRg9GA0LMsIDE5NTIyMA!5e0!3m2!1sru!2sru!4v1677000000000!5m2!1sru!2sru`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </FadeSection>
          </div>
        </section>
      </main>

      <Footer />

      {/* Product modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
