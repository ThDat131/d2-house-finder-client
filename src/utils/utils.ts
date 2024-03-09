import { Article } from '../model/article/article'

export const VNDCurrencyFormat = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

export function decodeHtmlEntities(input: string) {
  const doc = new DOMParser().parseFromString(input, 'text/html')
  return doc.documentElement.textContent
}

export const getExactAddress = (data: Article): string => {
  if (
    data.address.provinceName &&
    data.address.districtName &&
    data.address.wardName &&
    data.address.streetAddress
  )
    return `${data.address.streetAddress}, ${data.address.wardName}, ${data.address.districtName}, ${data.address.provinceName}`
  if (
    data.address.provinceName &&
    data.address.districtName &&
    data.address.wardName
  )
    return `${data.address.streetAddress}, ${data.address.wardName}, ${data.address.districtName}`
  if (data.address.provinceName && data.address.districtName)
    return `${data.address.districtName}, ${data.address.provinceName}`
  if (data.address.provinceName) return data.address.provinceName
  return ''
}

export const getProvinceAndDistrict = (data: Article): string => {
  if (data.address.provinceName && data.address.districtName)
    return `${data.address.districtName}, ${data.address.provinceName}`
  if (data.address.provinceName) return data.address.provinceName
  return ''
}
