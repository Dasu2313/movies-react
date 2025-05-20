import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from './SessionContext'

const RateContext = createContext()

const fetchRated = async (sessionId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjA2MmQ0MmQwODQ5ZDZlOWM3NzA4YmZjYzUwNmM2NyIsIm5iZiI6MTc0NzQ5MzI5My4xNDgsInN1YiI6IjY4MjhhMWFkMWFhNzBlNWMzODllMmQ3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P1B8lBGy57pT30_UzORuLzWkYlNUpKVQ4MHbEHWpSLU',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.results || [] // Возвращаем только массив результатов
  } catch (e) {
    console.error('Failed to fetch rated movies:', e)
    return [] // В случае ошибки возвращаем пустой массив
  }
}
export const RateContextProvider = ({ children }) => {
  const [rated, setRated] = useState([])
  const [filmRatingMap, setFilmRatingMap] = useState(new Map())

  const { session } = useSession()

  useEffect(() => {
    if (session !== null)
      fetchRated(session).then((res) => {
        setRated(res)
        setFilmRatingMap(new Map(res.map((val) => [val.id, val.rating])))
      })
  }, [session])

  const addRatedFilm = (film) => {
    setRated((prevRated) => {
      const existingIndex = prevRated.findIndex((item) => item.id === film.id)

      if (existingIndex >= 0) {
        const updated = [...prevRated]
        updated[existingIndex] = film
        return updated
      } else {
        return [...prevRated, film]
      }
    })

    const newFilmRatingMap = new Map(filmRatingMap)
    newFilmRatingMap.set(film.id, film.rating)
    setFilmRatingMap(newFilmRatingMap)
  }

  return (
    <RateContext.Provider value={{ rated, filmRatingMap, addRatedFilm }}>
      {children}
    </RateContext.Provider>
  )
}

export const useRated = () => {
  const context = useContext(RateContext)
  if (!context) throw new Error()

  return context
}
