import Image from 'next/image'
import { useRouter } from 'next/router'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabaseClient'

type Link = {
  title: string
  url: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>()
  const [url, setUrl] = useState<string | undefined>()
  const [links, setLinks] = useState<Link[]>()
  const [images, setImages] = useState<ImageListType>([])
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | undefined>()

  const router = useRouter()
  const { creatorSlug } = router.query
  console.log('creatorSlug1: ', creatorSlug)

  const onChange = (imageList: ImageListType) => {
    setImages(imageList)
  }

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser()
      console.log('user: ', user)
      if (user.data.user) {
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
          .eq('user_id', userId)
        if (error) throw error
        setLinks(data)
      } catch (error) {
        console.log('error: ', error)
      }
    }
    if (userId) getLinks()
  }, [userId])

  useEffect(() => {
    const getUser = async () => {
      try {
        if (userId) {
          const { data, error } = await supabase
            .from('users')
            .select('id, profile_picture_url')
            .eq('id', creatorSlug)
          if (error) throw error
          console.log('data: ', data)
          const profilePictureUrl = data[0].profile_picture_url
          const userId = data[0]['id']
          setProfilePictureUrl(profilePictureUrl)
          setUserId(userId)
        }
      } catch (error) {
        console.log('error: ', error)
      }
    }

    if (creatorSlug) getUser()
  }, [userId, creatorSlug])

  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const { data, error } = await supabase
          .from('links')
          .insert({
            title,
            url,
            user_id: userId
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

  const uploadProfilePictures = async () => {
    try {
      if (images.length > 0) {
        const image = images[0]
        if (image.file && userId) {
          const { data, error } = await supabase.storage
            .from('public')
            .upload(`${userId}/${image.file.name}`, image.file, { upsert: true })
          if (error) throw error
          const resp = supabase.storage.from('public').getPublicUrl(data.path)
          const publicUrl = resp.data.publicUrl
          const updateUserResponse = await supabase
            .from('users')
            .update({ profile_picture_url: publicUrl })
            .eq('id', userId)
          if (updateUserResponse.error) throw updateUserResponse.error
        }
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center mt-4">
      {profilePictureUrl && (
        <Image
          src={profilePictureUrl}
          height={100}
          width={100}
          alt="avatar"
          className="rounded-full border-black border"
        />
      )}
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
          <div>
            <h1>New link creation</h1>
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
          </div>
          <div>
            <h1>Image upload</h1>
            <ImageUploading multiple value={images} onChange={onChange} maxNumber={1}>
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps
              }) => (
                // write your building UI
                <div className="upload__image-wrapper bg-slate-200 p-4">
                  <button
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                    className="mb-2"
                  >
                    Click or Drop here
                  </button>
                  <br />

                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <Image src={image?.dataURL} alt="" height={100} width={100} />
                      <div className="image-item__btn-wrapper">
                        <button onClick={() => onImageUpdate(index)}>Update</button>
                        <button onClick={() => onImageRemove(index)}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={onImageRemoveAll}>Remove all images</button>
                </div>
              )}
            </ImageUploading>

            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-4 py-2 text-sm "
              onClick={uploadProfilePictures}
            >
              Upload profile picture
            </button>
          </div>
        </>
      )}
    </div>
  )
}
