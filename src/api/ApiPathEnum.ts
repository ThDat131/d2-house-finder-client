const prefix = '/api'

export const ApiPathEnum = {
  Article: `${prefix}/v1/articles`,
  Categories: `${prefix}/v1/categories`,
  Comments: `${prefix}/v1/comments`,
  Users: `${prefix}/v1/users`,
  Signin: `${prefix}/v1/auth/login`,
  Geocode: 'geocode',
  GetUserByRefreshToken: `${prefix}/v1/auth/refresh`,
  GetAllProvinces: 'api/province',
  GetAllDistricts: 'api/province/district',
  GetAllWards: '/api/province/ward',
  UploadSingleFile: `${prefix}/v1/files/upload`,
}
