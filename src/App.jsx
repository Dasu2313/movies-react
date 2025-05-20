import { useEffect, useState } from 'react'
import './app.css'
import Card from './components/Card'
import CardImage from './components/CardImage'
import CardInfo from './components/CardInfo'
import Container from './components/Container'
import { format } from 'date-fns' // Убрали parseISO
import { Alert, Pagination, Rate, Spin } from 'antd'
import { debounce } from 'lodash'
import { useGenres } from './components/GenreContext'
import { useSession } from './components/SessionContext'
import { useRated } from './components/RateContext'

const fetchMovies = async (page, query) => {
  try {
    return await fetch(
      `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=${page}&query=${query}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjA2MmQ0MmQwODQ5ZDZlOWM3NzA4YmZjYzUwNmM2NyIsIm5iZiI6MTc0NzQ5MzI5My4xNDgsInN1YiI6IjY4MjhhMWFkMWFhNzBlNWMzODllMmQ3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.P1B8lBGy57pT30_UzORuLzWkYlNUpKVQ4MHbEHWpSLU',
        },
      }
    ).then((res) => res.json())
  } catch (e) {
    return null
  }
}

const shortenText = (text, maxLength, ellipsis = '...') => {
  if (!text || text.length <= maxLength) {
    return text
  }

  let shortened = text.substr(0, maxLength - ellipsis.length)

  const lastSpaceIndex = Math.max(
    shortened.lastIndexOf(' '),
    shortened.lastIndexOf(','),
    shortened.lastIndexOf('.'),
    shortened.lastIndexOf('!'),
    shortened.lastIndexOf('?'),
    shortened.lastIndexOf(';'),
    shortened.lastIndexOf(':')
  )

  if (lastSpaceIndex > 0) {
    shortened = shortened.substr(0, lastSpaceIndex)
  }

  shortened = shortened.replace(/[,.;:!?]+$/, '')

  return shortened + ellipsis
}

const App = () => {
  const [movies, setMovies] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('return')
  const { genres } = useGenres()
  const { session } = useSession()
  const { rated, filmRatingMap, addRatedFilm } = useRated()
  const [tab, setTab] = useState('Search')

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    setIsLoaded(false)

    fetchMovies(page, query).then((mov) => {
      if (mov !== null) {
        setMovies(mov.results)
        setTotalPages(mov.total_pages)
      } else setIsError(true)

      setIsLoaded(true)
    })
  }, [page, query])

  const search = debounce((query) => {
    setQuery(query)
  }, 512)

  const rateMovie = async (movieId, rate) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${session}&api_key=52062d42d0849d6e9c7708bfcc506c67`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: rate,
        }),
      }
    )

    return res.json()
  }

  const getFilmList = () => {
    if (tab === 'Search') return movies

    if (tab === 'Rated') return rated
  }

  const calculateRateColor = (rate) => {
    const fixedRate = rate.toFixed(1)

    if (fixedRate < 3) return '#E90000'

    if (fixedRate < 5) return '#E97E00'

    if (fixedRate < 7) return '#E9D100'

    return '#66E900'
  }

  return (
    <>
      <Spin spinning={!isLoaded} fullscreen></Spin>
      {isLoaded && isError && (
        <Alert type="error" message="Ошибка" description="Ошибка соединения с сервером" />
      )}
      {isLoaded && !isError && (movies === null || movies.length === 0) && (
        <Alert type="info" message="Фильмы не найдены" />
      )}
      <div className="div-buttonSearchRated">
        <button onClick={() => setTab('Search')} className="buttonSearchRated">
          Search
        </button>
        {rated !== null && (
          <button onClick={() => setTab('Rated')} className="buttonSearchRated">
            Rated
          </button>
        )}
      </div>
      <Container>
        {tab === 'Search' && (
          <input
            onChange={(event) => {
              search.cancel()

              search(event.target.value)
            }}
            placeholder="Type to search..."
            className="inputType"
          ></input>
        )}
      </Container>
      <Container>
        {getFilmList() !== null &&
          getFilmList()
            .filter((val) => val.poster_path !== null)
            .map((val) => (
              <Card>
                <CardImage posterPath={val.poster_path} />
                <CardInfo>
                  <div className="cardDivTitle">
                    <h5 className="cardTitle">{val.title}</h5>
                    <p
                      className="cardRating"
                      style={{ borderColor: calculateRateColor(val.vote_average) }}
                    >
                      {val.vote_average.toFixed(1)}
                    </p>
                  </div>
                  <p className="cardDate">
                    {val.release_date !== ''
                      ? format(new Date(val.release_date), 'MMMM d, yyyy')
                      : 'Unknown'}
                  </p>
                  <div className="cardTags">
                    {genres !== null &&
                      typeof genres !== 'undefined' &&
                      val.genre_ids.map((val) => (
                        <button className="cardTag">{genres.get(val)}</button>
                      ))}
                  </div>
                  <p className="card-description">{shortenText(val.overview, 128)}</p>
                  {session !== null && filmRatingMap !== null && addRatedFilm !== null && (
                    <Rate
                      value={filmRatingMap.get(val.id)}
                      onChange={(rate) => {
                        rateMovie(val.id, rate).then(() => {
                          addRatedFilm({ ...val, rating: rate })
                        })
                      }}
                      count={10}
                      className="cardStars"
                      style={{ fontSize: '15px' }}
                    ></Rate>
                  )}
                  {/* <img className="cardStars" src='/image1.png'/> */}
                </CardInfo>
              </Card>
            ))}
      </Container>
      {tab === 'Search' && (
        <Container>
          <Pagination
            className="divPaginaton"
            showSizeChanger={false}
            total={totalPages}
            onChange={(page) => {
              setPage(page)
            }}
          />
        </Container>
      )}
    </>
  )
}

export default App
