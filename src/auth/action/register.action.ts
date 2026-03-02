import { testShopApi } from "@/api/testShopApi"
import type { AuthResponse } from "../interfaces/auth.response"


export const registerAction = async(
    fullName: string,
    email: string, 
    password: string,
): Promise<AuthResponse> => {

    try {
        const {data} = await testShopApi.post<AuthResponse>('/auth/register',{
            fullName,
            email,
            password,
        })
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}