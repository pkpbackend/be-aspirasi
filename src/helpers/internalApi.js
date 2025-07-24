import axios from 'axios'
import { API_KEY, API_MASTER, API_PENGUSULAN } from '../config/env'

function mkInternalApi(baseURL, accessToken) {
  const internalApi = axios.create({ 
    baseURL,
  })
  
  internalApi.interceptors.request.use(function (config) {
    // Do something before request is sent
  
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
      return config
    }

    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })
  
  internalApi.interceptors.response.use(function (response) {
    // Do something with response data
    // response.data = (response.data).data
    return response
  }, function (error) {
    // Do something with response error
    return Promise.reject(error)
  })

  return internalApi
}

export const mkApiMaster = (accessToken) => mkInternalApi(`${API_MASTER}/v3`, accessToken)
export const mkApiPengusulan = (accessToken) => mkInternalApi(`${API_PENGUSULAN}/v3`, accessToken)
