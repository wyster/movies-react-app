import { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client/react'
import {NavLink} from "react-router";

const SEARCH = gql`
  query Search($q: String) {
    search(q: $q) @rest(type: "Search", path: "search?q={args.q}") {
      name,
      id
    }
  }
`

function Search () {
  const [load, { loading, error, data: results }] = useLazyQuery(SEARCH)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!query) {
      return
    }
    load({ variables: { q: query } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
    }
  }, [])

  function onChange (value) {
    if (!value) {
      window.history.pushState({}, document.title, window.location.pathname)
    } else {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('q', value)
      window.history.pushState({}, document.title, `?${searchParams.toString()}`)
    }
    setQuery(value);
  }

  return (
    <>
      <label className="w-100">
        <div className="input-group input-group-lg">
          <input
            onChange={(e) => onChange(e.target.value)}
            value={query}
            className={`form-control ${error ? 'is-invalid' : ''}`}
          />
          {loading && (
            <div className="input-group-text">
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </label>
      {results?.search && (
        <ul className="list-group">
          {results.search.map(item => (
            <li className="list-group-item" key={item.id}>
              <NavLink to={`/movie/${item.id}`}>{item.name}</NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Search
