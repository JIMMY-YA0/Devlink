import Image from 'next/image'
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabaseClient'

type Link = {
  title: string
  url: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [useId, setUserId] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>()
  const [url, setUrl] = useState<string | undefined>()
  const [links, setLinks] = useState<Link[]>()

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser()
      console.log('user: ', user)
      if (user) {
        const userId = user.data.user?.id
        setIsAuthenticated(true)
        setUserId(userId)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('title, url')
          .eq('user_id', useId)
        if (error) throw error
        setLinks(data)
      } catch (error) {
        console.log('error: ', error)
      }
    }
    if (useId) getLinks()
  }, [useId])

  const addNewLink = async () => {
    try {
      if (title && url && useId) {
        const { data, error } = await supabase
          .from('links')
          .insert({
            title,
            url,
            user_id: useId
          })
          .select()
        if (error) throw error
        console.log('data: ', data)
        setLinks([...data, ...links])
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center mt-4">
      {links?.map((link: Link, index: number) => (
        <div className="mt-4 flex text-center text-white" key={index}>
          <a
            className="shadow-xl w-96 p-4 bg-indigo-400 rounded-lg"
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            {link.title}
          </a>
        </div>
      ))}
      {isAuthenticated && (
        <>
          <div className="mt-4">
            Title
            <input
              type="text"
              id="title"
              name="title"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="my awesome link"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mt-4">
            URL
            <input
              type="text"
              id="url"
              name="url"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://jimmyyao.com.au/"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-4 py-2 text-sm "
              onClick={addNewLink}
            >
              Add new link
            </button>
          </div>
        </>
      )}
    </div>
  )
}
