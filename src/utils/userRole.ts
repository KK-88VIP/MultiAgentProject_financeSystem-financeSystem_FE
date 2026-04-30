/**
 * 与 Python 文档 20.11 一致：请求头 X-User-Role 仅传 admin | user
 */
export function resolveXUserRole(): 'admin' | 'user' {
  const raw = String(import.meta.env.VITE_DEFAULT_USER_ROLE || 'user').toLowerCase();
  if (raw === 'admin' || raw === 'management' || raw === 'system_admin') {
    return 'admin';
  }
  return 'user';
}
