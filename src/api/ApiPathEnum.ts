const prefix = '/api'

export enum ApiPathEnum {
  Category = '/category',
  GetAllUser = `${prefix}/v1/users`,
  Signin = `${prefix}/v1/auth/login`,
  GetUserByRefreshToken = `${prefix}/v1/auth/refresh`,
  GetAllProvinces = 'api/province',
  GetAllDistricts = 'api/province/district',
  GetAllWards = '/api/province/ward',
}
