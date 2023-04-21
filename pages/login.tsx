import { useRouter } from 'next/router'
import supabase from '@/utils/supabaseClient'
import { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const router = useRouter()
  async function signInWithEmail() {
    try {
      if (email && password) {
        const response = await supabase.auth.signInWithPassword({ email, password })
        console.log('response: ', response)
        if (response.error) throw response.error
        const userId = response.data.user?.id
        console.log('UserId: ', userId)
        router.push('/')
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
          password
        </label>
        <div className="mt-1">
          <input
            type="password"
            id="password"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4 px-4 py-2 text-sm "
          onClick={signInWithEmail}
        >
          Sign in
        </button>
      </div>
    </>
  )
}

export default Login
