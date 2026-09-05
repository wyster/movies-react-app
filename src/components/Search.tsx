import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSearch } from '../api'
import { NavLink } from 'react-router'


interface SearchResult {
  id: number
  name: string
  year: number
}

function Search() {
  const [query, setQuery] = useState('')
  const { isLoading: loading, error, data: results } = useQuery<SearchResult[]>({ queryKey: ['search', query], queryFn: () => getSearch(query), enabled: query.length >= 3 })

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length >= 3) {
      }
    }, 500)

    return () => clearTimeout(handler)
  }, [query])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [])

  function onChange(value: string) {
    if (!value) {
      window.history.pushState({}, document.title, window.location.pathname)
    } else {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('q', value)
      window.history.pushState(
        {},
        document.title,
        `?${searchParams.toString()}`,
      )
    }
    setQuery(value)
  }

  return (
    <>
      <label className="w-100">
        <div className="input-group input-group-lg">
          <input
            onChange={event => onChange(event.target.value)}
            value={query}
            className={`form-control ${error ? 'is-invalid' : ''}`}
          />
          {loading && (
            <div className="input-group-text">
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </label>
      {results && (
        <ul className="list-group">
          {results.map(item => (
            <li className="list-group-item" key={item.id}>
              <NavLink to={`/movie/${item.id}`}>
                {item.name} ({item.year})
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Search
