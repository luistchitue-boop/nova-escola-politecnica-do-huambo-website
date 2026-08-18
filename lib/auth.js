import { getSession } from 'next-auth/react'

export async function requireAdminSession(context) {
  const session = await getSession(context)

  if (!session || !session.user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      session,
    },
  }
}
