import i18next from 'i18next'
import Vietnamese from './vn.json'
import English from './en.json'
import { initReactI18next } from 'react-i18next'

const resources = {
  vn: {
    translation: Vietnamese,
  },
  en: {
    translation: English,
  },
}

i18next.use(initReactI18next).init({
  lng: localStorage.getItem('lang') ?? 'vn',
  debug: false,
  resources,
})

export default i18next
