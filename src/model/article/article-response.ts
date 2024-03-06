import { Comment } from '../comment/comment'
import { type CommonResponse } from '../common/common-response'
import { type Article } from './article'

interface ArticlesResponse {
  meta: {
    current: number
    pageSize: number
    pages: number
    total: number
  }
  results: Article[]
}

interface ArticleResponse {
  comments: Comment[]
  article: Article
}

export interface GetArticlesResponse extends CommonResponse<ArticlesResponse> {}

export interface GetArticleResponse extends CommonResponse<ArticleResponse> {}
