import { testShopApi } from "@/api/testShopApi";

export interface Options {
    limit? : number | string,
    offset? : number | string,
    query? : string,
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  phone: string | null;
  address: string | null;
  createdAt: string;
}

export interface GetAdminUsersResponse {
  count: number;
  users: AdminUser[];
  pages: number,
}

export const getUsersAction = async (options: Options): Promise<GetAdminUsersResponse> => {

  const {limit, offset, query} = options
  const { data } = await testShopApi.get<GetAdminUsersResponse>('/auth/users', 
    {
        params: {
            limit,
            offset,
            q: query
        }
    }
  );
  return {...data};
};