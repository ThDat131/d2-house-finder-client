export interface ArticleCreatedModel {
  title: string
  description: string
  categoryId: string
  price: number
  acreage: number
  streetAddress: string
  latitude: number
  longitude: number
  provinceCode: string
  districtCode: string
  wardCode: string
  provinceName: string
  districtName: string
  wardName: string
  images: string[]
  quantity: number
}
