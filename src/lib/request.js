import axios from 'axios'
import { message } from 'antd'

const defaultAxiosConf = {
  timeout: 5000
}

const _request = (params = {}, fn = () => {}) => {
  return axios({ ...defaultAxiosConf, ...params})
          .then( res => {
            const { success, data, err, code } = res.data

            if (code === 401) {
              window.location.href = '/'
              return
            }

            if (success) {
              fn(false)

              return data
            }

            throw err            
          })
          .catch(err => {
            fn(false)

            message.error(String(err || '网络错误'))
          })
}

export default (params) => {
  const type = typeof params

  if (type === 'function') {
    params(true)

    return (obj) => _request(obj, params)
  }

  if (type === 'object' && type !== null) {
    return _request(params)
  }
} 