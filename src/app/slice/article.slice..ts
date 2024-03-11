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
import {
  GetArticleResponse,
  type GetArticlesResponse,
} from '../../model/article/article-response'
import { type Article } from '../../model/article/article'
import { Comment } from '../../model/comment/comment'

interface ArticleStateProps {
  articles: Article[]
  currentArticle: Article | null
  comments: Comment[]
  pageSize: number
  pageCurrent: number
  totalPage: number
  totalPost: number
  error: string
  loading: boolean
}

interface CreateCommentReplyProps {
  id: string
  data: {
    content: string
  }
}

interface EditCommentReplyProps {
  id: string
  data: {
    reply_id: string
    content: string
  }
}

interface CreateCommentReplyTemp {
  commentId: string
  reply: Comment
}

interface EditCommentProps {
  id: string
  data: {
    content: string
    articleId: string
  }
}

interface meta {
  current: number
  categoryId?: string
}

const PAGE_SIZE = 2
const initialState: ArticleStateProps = {
  articles: [],
  currentArticle: null,
  comments: [],
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
  async (data: meta, thunkAPI) => {
    try {
      const response = await httpService.get<GetArticlesResponse>(
        ApiPathEnum.Article,
        {
          params: {
            current: data.current,
            pageSize: PAGE_SIZE,
            populate: 'createdBy',
            fields:
              'createdBy.fullName,createdBy.email,createdBy.avatar,createdBy.phone',
            categoryId: data.categoryId,
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

export const getArticle = createAsyncThunk(
  'article/getArticle',
  async (id: string, thunkAPI) => {
    try {
      const response = await httpService.get<GetArticleResponse>(
        `${ApiPathEnum.Article}/${id}`,
        {
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

export const createComment = createAsyncThunk(
  'comment/createComment',
  async (data: any, thunkAPI) => {
    try {
      const response = await authHttpService.post<CommonResponse<Comment>>(
        ApiPathEnum.Comments,
        data,
        {
          signal: thunkAPI.signal,
        },
      )

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const editComment = createAsyncThunk(
  'comment/editComment',
  async (data: EditCommentProps, thunkAPI) => {
    try {
      const response = await authHttpService.patch<CommonResponse<Comment>>(
        `${ApiPathEnum.Comments}/${data.id}`,
        data.data,
        {
          signal: thunkAPI.signal,
        },
      )

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createReplyComment = createAsyncThunk(
  'comment/createReplyComment',
  async (data: CreateCommentReplyProps, thunkAPI) => {
    try {
      const response = await authHttpService.patch(
        `${ApiPathEnum.Comments}/${data.id}/reply`,
        data.data,
        {
          signal: thunkAPI.signal,
        },
      )

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const editReplyComment = createAsyncThunk(
  'comment/editReplyComment',
  async (data: EditCommentReplyProps, thunkAPI) => {
    try {
      const response = await authHttpService.put(
        `${ApiPathEnum.Comments}/${data.id}/reply`,
        data.data,
        {
          signal: thunkAPI.signal,
        },
      )

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
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
    addTempComment: (state, action: PayloadAction<Comment>) => {
      state.comments.unshift(action.payload)
    },
    editTempComment: (state, action: PayloadAction<Comment>) => {
      const index = state.comments.findIndex(x => x._id === action.payload._id)
      if (index >= 0) {
        state.comments[index].content = action.payload.content
      }
    },
    addTempReplyComment: (
      state,
      action: PayloadAction<CreateCommentReplyTemp>,
    ) => {
      const comment = state.comments.find(
        x => x._id === action.payload.commentId,
      )
      comment?.replies.unshift(action.payload.reply)
    },
    editTempReplyComment: (
      state,
      action: PayloadAction<CreateCommentReplyTemp>,
    ) => {
      const commentIndex = state.comments.findIndex(
        x => x._id === action.payload.commentId,
      )
      if (commentIndex >= 0) {
        const index = state.comments[commentIndex].replies.findIndex(
          x => x._id === action.payload.reply._id,
        )
        console.log(state.comments)
        if (index >= 0) {
          state.comments[commentIndex].replies[index].content =
            action.payload.reply.content
        }
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getArticles.pending, state => {
      state.loading = true
    })
    builder.addCase(
      getArticles.fulfilled,
      (state, action: PayloadAction<GetArticlesResponse>) => {
        state.articles = action.payload.data.results
        state.pageCurrent = action.payload.data.meta.current
        state.pageSize = action.payload.data.meta.pageSize
        state.totalPage = action.payload.data.meta.pages
        state.totalPost = action.payload.data.meta.total
        state.loading = false
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

    builder.addCase(getArticle.pending, state => {
      state.loading = true
    })
    builder.addCase(
      getArticle.fulfilled,
      (state, action: PayloadAction<GetArticleResponse>) => {
        state.currentArticle = action.payload.data.article
        state.comments = action.payload.data.comments
        state.loading = false
      },
    )
    builder.addCase(
      createComment.fulfilled,
      (state, action: PayloadAction<CommonResponse<Comment>>) => {
        const index = state.comments.findIndex(
          x => x.content === action.payload.data.content,
        )
        if (index >= 0) {
          state.comments[index]._id = action.payload.data._id
        }
      },
    )
  },
})

export const {
  clearError,
  addTempComment,
  editTempComment,
  addTempReplyComment,
  editTempReplyComment,
} = articleSlice.actions

const articleReducer = articleSlice.reducer

export default articleReducer
