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
import { ArticleStatus } from '../../common/common-enum'

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

interface Meta {
  current: number
  filter?: string
  title?: string
  categoryId?: {
    _id: string
    name: string
  }
  price?: number[]
  acreage?: number[]
  status?: ArticleStatus
}

const PAGE_SIZE = import.meta.env.VITE_PAGE_SIZE
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
const { httpService } = new HttpService()

export const getArticles = createAsyncThunk(
  'article/getArticles',
  async (data: Meta, thunkAPI) => {
    let params: any = {
      current: data.current,
      pageSize: PAGE_SIZE,
      populate: 'createdBy,categoryId',
      fields:
        'createdBy.fullName,createdBy.email,createdBy.avatar,createdBy.phone,categoryId.name,categoryId._id',
    }

    if (data?.title) {
      params = {
        ...params,
        title: data.title,
      }
    }

    if (data?.status) {
      params = {
        ...params,
        status: data.status,
      }
    }
    if (data?.price) {
      if (data.price[1] === 0) {
        params = {
          ...params,
          filter: {
            price: {
              $gte: data.price[0],
            },
          },
        }
      } else {
        params = {
          ...params,
          filter: {
            price: {
              $lte: data.price[1],
              $gte: data.price[0],
            },
          },
        }
      }
    }

    if (data?.acreage) {
      if (data.acreage[1] === 0) {
        params = {
          ...params,
          filter: {
            acreage: {
              $gte: data.acreage[0],
            },
          },
        }
      } else {
        params = {
          ...params,
          filter: {
            acreage: {
              $lte: data.acreage[1],
              $gte: data.acreage[0],
            },
          },
        }
      }
    }

    try {
      const response = await httpService.get<GetArticlesResponse>(
        `${ApiPathEnum.Article}${data.filter ?? ''}`,
        {
          params,
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
      const response = await httpService.post<
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

export const updateArticle = createAsyncThunk(
  'article/updateArticle',
  async (article: ArticleCreatedModel, thunkAPI) => {
    try {
      const response = await httpService.patch<
        CommonResponse<Article> | ErrorResponse
      >(`${ApiPathEnum.Article}`, article, {
        signal: thunkAPI.signal,
      })

      if (response.status !== 200) {
        throw new Error(response.data.message)
      }

      return response.data as CommonResponse<Article>
    } catch (ex) {
      const error = ex as Error
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)

export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (id: string, thunkAPI) => {
    try {
      const response = await httpService.delete(
        `${ApiPathEnum.Article}/${id}`,
        {
          signal: thunkAPI.signal,
        },
      )

      if (response.status !== 200) {
        throw new Error(response.data.message)
      }
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
      const response = await httpService.post<CommonResponse<Comment>>(
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
      const response = await httpService.patch<CommonResponse<Comment>>(
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
      const response = await httpService.patch(
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
      const response = await httpService.put(
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
    builder.addCase(updateArticle.pending, state => {
      state.loading = true
    })
    builder.addCase(updateArticle.rejected, state => {
      state.loading = false
    })
    builder.addCase(updateArticle.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(deleteArticle.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteArticle.rejected, state => {
      state.loading = false
    })
    builder.addCase(deleteArticle.fulfilled, state => {
      state.loading = false
    })
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
