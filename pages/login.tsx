import { useState } from 'react'

const login = () => {
  const [email, setEmail] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()

  return <div>login</div>
}

export default login
