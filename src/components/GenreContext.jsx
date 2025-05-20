import { createContext, useContext, useEffect, useState } from 'react'

const GenreContext = createContext()

const fetchGenres = async () => {
  try {
    return await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', {
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

export const GenreContextProvider = ({ children }) => {
  const [genres, setGenres] = useState(new Map())

  useEffect(() => {
    fetchGenres().then((genres) => {
      if (genres !== null) setGenres(new Map(genres.genres.map((val) => [val.id, val.name])))
    })
  }, [])

  return <GenreContext.Provider value={{ genres }}>{children}</GenreContext.Provider>
}

export const useGenres = () => {
  const context = useContext(GenreContext)
  if (!context) throw new Error()

  return context
}
