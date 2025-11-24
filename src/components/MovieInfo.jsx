import {useCallback, useEffect, useState} from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Serial from "./Serial";
import Film from "./Film";
import {Link} from "react-router";
import * as yup from "yup";

const GET_MOVIE_DETAILS = gql`
  query MovieDetails($id: Number) {
    movie(id: $id) @rest(type: "MovieDetails", path: "details?id={args.id}") {
      isSerial,
      name,
      description,
      poster,
      translators
    }
  }
`

const querySchema = yup.object().shape({
  translator: yup.number().nullable(),
  episode: yup.number().nullable(),
  season: yup.number().nullable(),
  quality: yup.string().nullable(),
  time: yup.number().nullable(),
  volume: yup.number().nullable(),
  autoPlay: yup.bool().nullable()
})

const defaultQuery = {
  translator: null,
  episode: null,
  season: null,
  quality: null,
  time: 0,
  volume: 100,
  autoPlay: false
};

function MovieInfo ({ id }) {
  const { loading, error, data } = useQuery(GET_MOVIE_DETAILS, { variables: { id }, skip: !id, })
  const [query, setQuery] = useState(defaultQuery)

  const onUpdateState = useCallback(values => {
    setQuery(q => ({...defaultQuery, ...q, ...values }))

    const searchParams = new URLSearchParams(window.location.search)
    Object.entries(values).forEach(item => {
      const [name, value] = item
      searchParams.set(name, value)
    })
    const newQuery = `?${searchParams.toString()}`
    if (window.location.search === newQuery) {
      return
    }
    const data = {...window.history.state, ...values};
    window.history.pushState(data, document.title, newQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function buildDocumentTitle(movieInfo, queryData) {
    const title = [movieInfo.name];
    if (queryData.season) {
      title.push(`Сезон ${queryData.season}`)
    }
    if (queryData.episode) {
      title.push(`Серия ${queryData.episode}`)
    }

    document.title = title.join(' / ')
  }

  useEffect(() => {
    if (!data || !query) {
      return
    }
    const { movie: movieInfo } = data
    buildDocumentTitle(movieInfo, query)
  }, [data, query])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setQuery(q => ({ ...q, ...querySchema.cast(Object.fromEntries(searchParams)) }))

    window.addEventListener('popstate', event => {
      if (event.state === null) {
        return
      }
      setQuery(q => ({...defaultQuery, ...querySchema.cast(event.state) }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!id) return <p>No ID</p>;

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    )
  }

  if (error) {
    return `Error! ${error}`
  }

  const { movie: movieInfo } = data

  return (
    <>
      {movieInfo && (
        <h4>{movieInfo.name}</h4>
      )}
      {movieInfo && movieInfo.isSerial && (
        <Serial
          serialId={id}
          translatorId={query.translator}
          episodeId={query.episode}
          seasonId={query.season}
          quality={query.quality}
          onUpdateState={onUpdateState}
          playerTime={query.time}
          playerVolume={query.volume}
          playerAutoPlay={query.autoPlay}
        />
      )}
      {movieInfo && !movieInfo.isSerial && (
        <Film
          filmId={id}
          translatorId={query.translator}
          translators={movieInfo.translators}
          quality={query.quality}
          onUpdateState={onUpdateState}
          playerTime={query.time}
          playerVolume={query.volume}
          playerAutoPlay={query.autoPlay}
        />
      )}
      {id && (
        <Link to={`/movie/${id}`}>Movie info</Link>
      )}
      <p>Movie info</p>
      <ul>
        <li><b>Movie ID:</b> {id}</li>
        {Object.entries(movieInfo).map(([label, value]) => (
          <li key={label}>
            <b style={{ marginRight: 10 }}>{label}:</b>
            {Array.isArray(value) && JSON.stringify(value)}
            {typeof value === 'string' && value}
            {typeof value === 'boolean' && (value ? 'Yes' : 'No')}
          </li>
        ))}
      </ul>
    </>
  )
}

export default MovieInfo
