import { getSession } from 'next-auth/react'

export async function requireAdminSession(context) {
  const session = await getSession(context)

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
