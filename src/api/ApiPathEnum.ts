const prefix = '/api'
const version = '/v1'

export const ApiPathEnum = {
  Article: `${prefix}${version}/articles`,
  Categories: `${prefix}${version}/categories`,
  Comments: `${prefix}${version}/comments`,
  SendCode: `${prefix}${version}/mail/send-passcode`,
  Users: `${prefix}${version}/users`,
  Signin: `${prefix}${version}/auth/login`,
  Signup: `${prefix}${version}/auth/register`,
  Verify: `${prefix}${version}/auth/verify`,
  GetUserByRefreshToken: `${prefix}${version}/auth/refresh`,
  GetAllProvinces: 'api/province',
  GetAllDistricts: 'api/province/district',
  GetAllWards: '/api/province/ward',
  UploadSingleFile: `${prefix}${version}/files/upload`,
  // GoongMap
  AutoComplete: 'Place/AutoComplete',
  Detail: 'Place/Detail',
  Geocode: 'geocode',
}
