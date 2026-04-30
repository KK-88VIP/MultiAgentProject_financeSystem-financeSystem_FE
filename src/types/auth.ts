export type UserRole = 'management' | 'sub_company_finance';

export interface UserPermission {
  role: UserRole;
  authorizedCompanies: string[];
  permissions: string[];
}

export interface BackendPermissionResponse {
  user_id: string;
  role: 'admin' | 'user' | 'system_admin' | string;
  authorized_companies: string[];
  allowed: boolean;
}