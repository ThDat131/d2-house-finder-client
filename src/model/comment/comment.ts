export interface Comment {
  _id?: string
  content: string
  articleId: string
  replies: Comment[]
  createdBy: {
    _id: string
    fullName: string
    avatar: string
  }
  updatedBy?: {
    _id: string
    fullName: string
    avatar: string
  }
}
