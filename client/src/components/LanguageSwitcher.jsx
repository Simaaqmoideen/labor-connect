import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <select 
      value={i18n.language} 
      onChange={changeLanguage}
      className="form-select"
      style={{ width: 'auto', padding: '6px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}
    >
      <option value="en">English</option>
      <option value="kn">ಕನ್ನಡ</option>
      <option value="hi">हिंदी</option>
    </select>
  );
};

export default LanguageSwitcher;
