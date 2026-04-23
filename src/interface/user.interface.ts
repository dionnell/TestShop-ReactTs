
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  roles: string[];
  createdAt?: string;
}
 