import { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client/react'
import {NavLink} from "react-router";

const SEARCH = gql`
  query Search($q: String) {
    search(q: $q) @rest(type: "Search", path: "search?q={args.q}") {
      name,
      id,
      year
    }
  }
`

function Search () {
  const [load, { loading, error, data: results }] = useLazyQuery(SEARCH)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query?.length >= 3) {
        load({variables: {q: query}})
      }
    }, 500); // 500ms debounce

    // Cleanup the timeout if value changes before 500ms
    return () => clearTimeout(handler);
  }, [query]);

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
              <NavLink to={`/movie/${item.id}`}>{item.name} ({item.year})</NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Search
