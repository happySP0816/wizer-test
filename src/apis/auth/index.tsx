import axios from 'src/services/interceptor'

export const signIn = async (payload: any) => {
    try {
        const response = await axios.post('/auth/signin', payload)
        if (response.data.user) {
            const { tokens, user } = response.data
            sessionStorage.setItem('userId', user.id)
            sessionStorage.setItem('token', tokens.accessToken)
            sessionStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('refreshToken', tokens.refreshToken)
            localStorage.setItem('token', tokens.accessToken)
            sessionStorage.setItem('img', user.image)
        }
    
        return response.data
    } catch (error) {
        return error
    }
}