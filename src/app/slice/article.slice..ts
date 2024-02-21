import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { HttpService } from '../../api/HttpService'
import { ApiPathEnum } from '../../api/ApiPathEnum'
import { type CommonResponse } from '../../model/common/common-response'
import { type ErrorResponse } from '../../model/common/error-response'
import { type Article } from '../../model/article/article'
import { type GetArticlesResponse } from '../../model/article/article-response'

const initialState = {
  articles: [] as Article[],
  error: '',
  loading: false,
}
const { authHttpService, httpService } = new HttpService()

export const getArticles = createAsyncThunk(
  'article/getArticles',
  async (_, thunkAPI) => {
    try {
      const response = await httpService.get<GetArticlesResponse>(
        ApiPathEnum.Article,
        {
          params: {
            current: 1,
            pageSize: 5,
          },
          signal: thunkAPI.signal,
        },
      )

      return response.data.data.results
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (article: Article, thunkAPI) => {
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
      (state, action: PayloadAction<Article[]>) => {
        state.articles = action.payload
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
