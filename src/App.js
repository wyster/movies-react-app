import { useState } from 'react'
import './App.css';
import MovieId from './components/MovieId'
import MovieInfo from './components/MovieInfo'
import Serial from './components/Serial'

function App() {
  const [movieId, setMovieId] = useState(null)
  const [movieInfo, setMovieInfo] = useState(null)

  function onChangeMovieId(value) {
    setMovieId(value);
    if (value === null) {
      setMovieInfo(null);
    }
  }

  function onChangeMovieInfo(value) {
    setMovieInfo(value);
  }

  return (
    <div className="App">
      <MovieId onChangeMovieId={onChangeMovieId} />
      {movieId && (
        <MovieInfo movieId={movieId} onChangeMovieInfo={onChangeMovieInfo} />
      )}
      {movieInfo && movieInfo.isSerial && (
        <Serial serialId={movieId} />
      )}
    </div>
  );
}

export default App;
