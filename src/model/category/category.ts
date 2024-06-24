export interface Category {
  _id?: string
  name: string | undefined
  active: boolean
  subCategories: string[] | SubCategory[]
}
