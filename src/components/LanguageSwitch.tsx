import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitchProps {
  isCollapsed?: boolean;
}

export function LanguageSwitch({ isCollapsed }: LanguageSwitchProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = React.useCallback(() => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  }, [i18n]);

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
      title={i18n.language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
    >
      <Globe size={20} />
      {!isCollapsed && (
        <span>{i18n.language === 'en' ? 'English' : 'தமிழ்'}</span>
      )}
    </button>
  );
}