import { createContext, useContext, useEffect, useState } from 'react'

const SessionContext = createContext()

const createSession = async () => {
  try {
    return await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjA2MmQ0MmQwODQ5ZDZlOWM3NzA4YmZjYzUwNmM2NyIsIm5iZiI6MTc0NzQ5MzI5My4xNDgsInN1YiI6IjY4MjhhMWFkMWFhNzBlNWMzODllMmQ3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P1B8lBGy57pT30_UzORuLzWkYlNUpKVQ4MHbEHWpSLU',
      },
    }).then((res) => res.json())
  } catch (e) {
    return null
  }
}

export const SessionContextProvider = ({ children }) => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    createSession().then((val) => {
      if (val !== null) setSession(val.guest_session_id)
    })
  }, [])

  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) throw new Error()

  return context
}
