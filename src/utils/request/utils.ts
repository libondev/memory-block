export const USER_TOKEN_KEY = 'fe.user.token'

export function getRedirectLoginPage() {
  const redirectPath = location.hash.slice(1).split('?')[0]

  return `/#/user/login?redirect=${redirectPath === '/user/login' ? '/' : redirectPath}`
}
