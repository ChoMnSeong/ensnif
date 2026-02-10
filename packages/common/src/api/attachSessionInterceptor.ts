import { AxiosInstance } from 'axios'

const attachSessionInterceptor = (instance: AxiosInstance) => {
    instance.defaults.withCredentials = true
}

export default attachSessionInterceptor
