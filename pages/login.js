import Head from 'next/head'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Credenciais inválidas. Verifique o email e a palavra-passe.')
      setIsSubmitting(false)
      return
    }

    router.push('/direccao')
  }

  return (
    <>
      <Head>
        <title>Login — Direção</title>
        <meta name="description" content="Login do painel administrativo da direção." />
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-[#f6f3eb] px-6 py-16">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7a5a15]">Direção</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Acesso administrativo</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#08263a]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Palavra-passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#08263a]"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#08263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3550] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'A iniciar sessão...' : 'Entrar'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
