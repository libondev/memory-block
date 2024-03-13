import axios from 'axios'
import jsCookie from 'js-cookie'
import { USER_TOKEN_KEY, getRedirectLoginPage } from './utils'
import { downloadBlobFile } from '../parsers/file'

export interface APIResponse<Data = any> {
  code: number

  // 成功
  data: Data

  // 失败
  detail: Data
  msg?: string
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: '/api',
})

const refreshing = false

const configsMap = new Map()

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${jsCookie.get(USER_TOKEN_KEY)}`

  // 如果是FormData 自动覆写请求头类型
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }

  // 如果正在刷新 token 则将后续的请求全部放入暂存区
  if (refreshing) {
    return new Promise((resolve) => {
      configsMap.set(config, resolve)
    })
  }

  // if (config.headers.token)
  //   refreshing = true

  // 刷新 token, 刷新后重新请求 configsMap 里的所有请求

  return config
})

instance.interceptors.response.use(({ data, headers }) => {
  return new Promise<any>((resolve, reject) => {
    // 如果是 blob 则当做文件下载
    if (data instanceof Blob) {
      // 从请求头中获取文件名
      const filename = headers['content-disposition'].replace(/\w+;\s?filename=(.*)/, '$1')
      downloadBlobFile(data, decodeURIComponent(filename))
      return resolve({ code: 200, msg: 'Success' })
    }

    if (data?.code === 200) {
      return resolve(data)
    }

    // token 过期跳转到登录页
    if (data?.code === 1026) {
      location.href = getRedirectLoginPage()
      return reject(data)
    }

    return reject(data)
  })
})

export function useGet<Detail>(...args: Parameters<typeof instance['get']>) {
  return instance.get<unknown, APIResponse<Detail>>(...args)
}

export function usePost<Detail>(...args: Parameters<typeof instance['post']>) {
  return instance.post<unknown, APIResponse<Detail>>(...args)
}

export function usePut<Detail>(...args: Parameters<typeof instance['put']>) {
  return instance.put<unknown, APIResponse<Detail>>(...args)
}

export function useDelete<Detail>(...args: Parameters<typeof instance['delete']>) {
  return instance.delete<unknown, APIResponse<Detail>>(...args)
}

export default instance
