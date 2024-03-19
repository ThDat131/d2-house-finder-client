export interface ArticleCreatedModel {
  title: string
  description: string
  categoryId: string
  price: number
  acreage: number
  streetAddress: string
  latitude: number
  longitude: number
  provinceCode: number
  districtCode: number
  wardCode: number
  provinceName: string
  districtName: string
  wardName: string
  images: string[]
  quantity: number
}
