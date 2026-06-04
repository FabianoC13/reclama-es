export function assertAdmin(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error('ADMIN_NOT_CONFIGURED');
  const header = request.headers.get('x-admin-secret');
  if (header !== secret) throw new Error('ADMIN_UNAUTHORIZED');
}
