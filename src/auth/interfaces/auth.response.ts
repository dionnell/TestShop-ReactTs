import type { User } from "@/interface/user.interface";


//login, register, check status
export interface AuthResponse {
    user:  User;
    token: string;
}
