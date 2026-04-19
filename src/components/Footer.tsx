import { COMPANY_INFO } from '@/lib/index';
import { Phone, Mail, MapPin, Clock, Building2 } from 'lucide-react';
import { SiTelegram } from 'react-icons/si';
import { useScrollTo } from '@/hooks/useCart';

export default function Footer() {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground" style={{ color: 'oklch(0.92 0.008 75)' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Ф</span>
              </div>
              <div>
                <div className="font-bold text-base leading-tight">«Форум»</div>
                <div className="text-xs opacity-60">Лесоматериалы с 2004 года</div>
              </div>
            </div>
            <p className="text-xs opacity-70 leading-relaxed mb-4">
              Надёжный поставщик качественных лесоматериалов и строительных материалов в Санкт-Петербурге. Оптовые поставки по всей России.
            </p>
              <a href={COMPANY_INFO.telegram} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-blue-500 transition-colors" aria-label="Telegram">
                <SiTelegram size={16} />
              </a>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-semibold text-sm mb-4 opacity-90">Каталог</h3>
            <ul className="space-y-2 text-xs opacity-70">
              {['Строительный брус', 'Обрезная доска', 'Вагонка', 'Половая доска', 'Фанера', 'OSB плиты', 'Клееный брус', 'Имитация бруса'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo('catalog')}
                    className="hover:opacity-100 hover:text-accent transition-opacity text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-sm mb-4 opacity-90">Информация</h3>
            <ul className="space-y-2 text-xs opacity-70">
              {[
                { label: 'О компании', href: 'about' },
                { label: 'Услуги и доставка', href: 'services' },
                { label: 'Контакты', href: 'contact' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className="hover:opacity-100 hover:text-accent transition-opacity"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li><span>Политика конфиденциальности</span></li>
              <li><span>Условия продажи</span></li>
              <li><span>Оферта</span></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-semibold text-sm mb-4 opacity-90">Контакты</h3>
            <ul className="space-y-3 text-xs opacity-70">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="flex-shrink-0 mt-0.5 opacity-80" />
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="flex-shrink-0 opacity-80" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:opacity-100 hover:text-accent transition-opacity">
                  {COMPANY_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="flex-shrink-0 opacity-80" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:opacity-100 hover:text-accent transition-opacity">
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="flex-shrink-0 opacity-80" />
                <span>{COMPANY_INFO.workHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal info */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs opacity-50">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>{COMPANY_INFO.fullName}</span>
              <span>ИНН {COMPANY_INFO.inn}</span>
              <span>ОГРН {COMPANY_INFO.ogrn}</span>
              <span>КПП {COMPANY_INFO.kpp}</span>
              <span>ОКПО {COMPANY_INFO.okpo}</span>
            </div>
            <span>© {year} «Форум». Все права защищены.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
