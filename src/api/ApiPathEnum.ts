const prefix = '/api'

export const ApiPathEnum = {
  Categories: `${prefix}/v1/categories`,
  GetAllUser: `${prefix}/v1/users`,
  Signin: `${prefix}/v1/auth/login`,
  GetUserByRefreshToken: `${prefix}/v1/auth/refresh`,
  GetAllProvinces: 'api/province',
  GetAllDistricts: 'api/province/district',
  GetAllWards: '/api/province/ward',
}
