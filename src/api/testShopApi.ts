import axios from 'axios'

const testShopApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

//Interceptores
testShopApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }


    return config
})


export {testShopApi}