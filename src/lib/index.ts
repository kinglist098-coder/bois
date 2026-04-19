// ==============================
// ROUTES
// ==============================
export const ROUTE_PATHS = {
  HOME: '/',
} as const;

// ==============================
// TYPES
// ==============================
export interface Product {
  id: string;
  name: string;
  categoryId: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  price: string | null;
  priceUnit?: string;
  inStock: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

// ==============================
// COMPANY INFO
// ==============================
export const COMPANY_INFO = {
  name: '«Форум»',
  fullName: '«ФОРУМ»',
  inn: '7801360287',
  ogrn: '1047855013700',
  kpp: '780401001',
  okpo: '73346479',
  director: 'Александров Сергей Дмитриевич',
  founded: '09.06.2004',
  address: '195220, г. Санкт-Петербург, Гражданский пр-кт, д. 26 литера А, помещ. 8-н, оф. 2-41',
  shortAddress: 'г. Санкт-Петербург, Гражданский пр-кт, д. 26',
  phone: '+7 (812) 648-23-93',
  email: 'info@sevles-spb.ru',
  workHours: 'Пн–Пт: 9:00 – 19:00, Сб: 10:00 – 16:00',
  telegram: 'https://t.me/sevles_spb_bot',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1991.0!2d30.33!3d60.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469635!2z0J_QsNGA0L3QsNGB!5e0!3m2!1sru!2sru!4v1',
  bases: [
    'Стройбаза Парнас: 1-й Верхний переулок, дом 8Б',
    'Стройбаза Парголово: Выборгское шоссе д. 232',
    'Стройбаза Вантовый мост: пос. Новосаратовка',
  ],
} as const;

// ==============================
// NAVIGATION
// ==============================
export const NAV_ITEMS = [
  { label: 'Главная', href: 'hero' },
  { label: 'Каталог', href: 'catalog' },
  { label: 'О компании', href: 'about' },
  { label: 'Услуги', href: 'services' },
  { label: 'Контакты', href: 'contact' },
] as const;
