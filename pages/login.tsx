import { useState } from 'react'

const login = () => {
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()

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
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4 px-4 py-2 text-sm "
        >
          Sign up
        </button>
      </div>
    </>
  )
}

export default login
