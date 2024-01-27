import i18next from 'i18next'
import Vietnamese from './vn.json'
import { initReactI18next } from 'react-i18next'

const resources = {
    vn: {
        translation: Vietnamese,
    },
}

i18next
    .use(initReactI18next)
    .init({
        lng: 'vn',
        debug: false,
        resources
    })

export default i18next
