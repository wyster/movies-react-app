import { useEffect, useRef, useState } from 'react'
import video from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import { useVideoJS } from "react-hook-videojs";
import Cast from '../../utils/Cast';
import gql from "graphql-tag";
import {useQuery} from "@apollo/client/react";
import useCast from "../../hooks/cast";

const GET_MOVIE_DETAILS = gql`
  query MovieDetails($id: Number) {
    movie(id: $id) @rest(type: "MovieDetails", path: "details?id={args.id}") {
      name,
      description,
      poster
    }
  }
`

function Player ({
  movieId,
  src,
  currentTime = null,
  volume = null,
  onCurrentTimeChange = () => {},
  onChangeVolume = () => {},
  onEnded = () => {},
  autoPlay = false
}) {
  const videoElement = useRef()
  const videoContainer = useRef()
  const [timer, setTimer] = useState(null)
  const {cast: myCastJs, myCast, setCast} = useCast();
  const { loading, error, data: movieData } = useQuery(GET_MOVIE_DETAILS, { variables: { id: movieId } })

  const { Video, player, ready } = useVideoJS(
    { sources: [{ src: src }] },
  );

  if (ready) {
    player.currentTime(currentTime);
  }

  function timeUpdate (e) {
    if (!ready || myCastJs?.state === 'playing') {
      return;
    }
    const value = parseInt(e.target.currentTime, 10)
    setTimer(current => {
      if (value === current) {
        return current
      }

      return value
    })
  }

  function volumeChange (e) {
    onChangeVolume(parseInt(e.target.volume * 100, 10))
  }

  function ended (e) {
    onEnded(parseInt(e.target.currentTime, 10))
  }

  function requestFullScreen()  {
    player.requestFullscreen();
  }

  function cast()  {
    if (myCast.connected) {
      if (myCastJs.src === src) {
        myCastJs.play();
        return;
      }
      if (currentTime) {
        myCastJs.seek(currentTime);
      }
      myCastJs.cast(src, {
        poster : movieData?.movie?.poster,
        title : movieData?.movie?.name,
        description: movieData?.movie?.description,
      });
      return;
    }

    const cast = new Cast({
      joinpolicy: 'origin_scoped',
    });
    // Catch all events except 'error'
    cast.on('event', (e) => {
      if (e === 'disconnect') {
        setTimer(cast.time);
        setCast(null);
      }
      if (e === 'session_error') {
        setCast(null);
      }
      console.log('event:', e, 'state:', cast.state)
    });
    cast.on('error', (e) => console.log(e));  // Catch any errors
    cast.on('disconnect', (e) => {
      console.log(e, 'disconnect')
      setCast(null);
    });
    if (!cast.available) {
      throw 'cast not available';
    }
    cast.time = currentTime;
    cast.cast(src, {
      poster : movieData?.movie?.poster,
      title : movieData?.movie?.name,
      description: movieData?.movie?.description,
    });
    setCast(cast);
  }

  useEffect(() => {
    if (!player) {
      return;
    }

    if (autoPlay) {
      player.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player])

  useEffect(() => {
    if (!videoElement.current || !videoElement.current.paused || !myCast.connected) {
      return
    }
    if (!currentTime) {
      return;
    }
    videoElement.current.currentTime = currentTime
  }, [currentTime])

  useEffect(() => {
    if (timer === null) {
      return
    }

    onCurrentTimeChange(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer])

  useEffect(() => {
    if (volume === null || !videoElement.current) {
      return
    }
    videoElement.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    if (myCast.paused) {
      setTimer(myCast.timer);
    }
  }, [myCast.paused]);

  function run() {
    const cast = new Cast({
      joinpolicy: 'origin_scoped',
    });
    // Catch all events except 'error'
    cast.on('event', (e) => {
      /*if (e === 'disconnect') {
        setTimer(cast.time);
        setCast(null);
      }
      if (e === 'session_error') {
        setCast(null);
      }*/
      console.log('event:', e, 'state:', cast.state)
    });
    cast.on('error', (e) => console.log(e));  // Catch any errors
    setCast(cast);
  }

  return (
    <>
      <button
        type="button"
        className={`btn`}
        onClick={e => {
          e.preventDefault();
          requestFullScreen()
        }}
      >
        Fullscreen
      </button>
      <button
        type="button"
        className={`btn`}
        onClick={e => {
          e.preventDefault();
          cast()
        }}
      >
        Cast
      </button>
      {currentTime > 0 && (
        <span className="badge rounded-pill bg-secondary" onClick={() => myCast.timer ? setTimer(myCast.timer) : null} title="Update current time">
          Current time {currentTime} sec
        </span>
      )}
      <div>
        {!myCast.connected && (
          <button
            type="button"
            className={`btn`}
            onClick={e => {
              e.preventDefault();
              run();
            }}
          >
            Connect to cast
          </button>
        )}
        {myCast.connected && (
          <button
            type="button"
            className={`btn`}
            onClick={e => {
              e.preventDefault();
              myCast.paused ? myCastJs.play() : myCastJs.pause();
            }}
          >
            {myCast.paused ? 'Play' : 'Pause'}
          </button>
        )}
        {myCast.connected && (
          <button
            type="button"
            className={`btn`}
            onClick={e => {
              e.preventDefault();
              myCastJs.disconnect();
            }}
          >
            Disconnect
          </button>
        )}
      </div>
      <div ref={videoContainer}>
        <Video
          ref={videoElement}
          className="video-js"
          controls
          onEnded={ended}
          onTimeUpdate={timeUpdate}
          onVolumeChange={volumeChange}
        />
      </div>
    </>
  )
}

export default Player
