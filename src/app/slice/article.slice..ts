import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { type CommonResponse } from '../../model/common/common-response'
import { type ErrorResponse } from '../../model/common/error-response'
import { type ArticleCreatedModel } from '../../model/article/article-create'
import { type GetArticlesResponse } from '../../model/article/article-response'
import { type Article } from '../../model/article/article'

interface ArticleStateProps {
  articles: Article[]
  pageSize: number
  pageCurrent: number
  totalPage: number
  totalPost: number
  error: string
  loading: boolean
}

const PAGE_SIZE = 2
const initialState: ArticleStateProps = {
  articles: [],
  pageSize: PAGE_SIZE,
  pageCurrent: 1,
  totalPage: 0,
  totalPost: 0,
  error: '',
  loading: false,
}
const { authHttpService, httpService } = new HttpService()

export const getArticles = createAsyncThunk(
  'article/getArticles',
  async (current: number, thunkAPI) => {
    try {
      const response = await httpService.get<GetArticlesResponse>(
        ApiPathEnum.Article,
        {
          params: {
            current,
            pageSize: PAGE_SIZE,
            populate: 'createdBy',
            fields:
              'createdBy.fullName,createdBy.email,createdBy.avatar,createdBy.phone',
          },
          signal: thunkAPI.signal,
        },
      )
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (article: ArticleCreatedModel, thunkAPI) => {
    try {
      const response = await authHttpService.post<
        CommonResponse<Article> | ErrorResponse
      >(ApiPathEnum.Article, article, {
        signal: thunkAPI.signal,
      })

      if (response.status === 400) {
        throw new Error(response.data.message)
      }

      return response.data as CommonResponse<Article>
    } catch (ex) {
      const error = ex as Error
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    clearError: state => {
      state.error = ''
    },
  },
  extraReducers(builder) {
    builder.addCase(
      getArticles.fulfilled,
      (state, action: PayloadAction<GetArticlesResponse>) => {
        state.articles = action.payload.data.results
        state.pageCurrent = action.payload.data.meta.current
        state.pageSize = action.payload.data.meta.pageSize
        state.totalPage = action.payload.data.meta.pages
        state.totalPost = action.payload.data.meta.total
      },
    )
    builder.addCase(
      createArticle.fulfilled,
      (state, action: PayloadAction<CommonResponse<Article>>) => {
        state.error = ''
        state.articles.push(action.payload.data)
      },
    )
    builder.addCase(createArticle.rejected, (state, action) => {
      state.error = action.payload as string
    })
  },
})

export const { clearError } = articleSlice.actions

const articleReducer = articleSlice.reducer

export default articleReducer
