import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const customAxios: AxiosInstance = axios.create({
    baseURL: 'https://api.wizer.life/api'
})

interface RetryableAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const requestHandler = (request: AxiosRequestConfig): any => {
    const token = localStorage.getItem('token')
    if (token) {
        request.headers = request.headers || {};
        request.headers.Authorization = `Bearer ${token}`;
    }

    return request
}

const responseHandler = (response: AxiosResponse): AxiosResponse => {
    return response
}

const errorHandler = async (error: AxiosError): Promise<AxiosError> => {
    const originalRequest = error.config as RetryableAxiosRequestConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refresh = localStorage.getItem('refreshToken');
            const response = await axios.post('https://api.wizer.life/api/auth/refresh', { 'refreshToken': refresh });
            const { accessToken, refreshToken } = response.data.tokens;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            customAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return customAxios(originalRequest);
        } catch (refreshError) {
            sessionStorage.clear()
            localStorage.clear()
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error)
}

customAxios.interceptors.request.use(
    request => requestHandler(request), (error: AxiosError) => errorHandler(error)
)

customAxios.interceptors.response.use(
    (response: AxiosResponse) => responseHandler(response), (error: AxiosError) => errorHandler(error)
)

export default customAxios
