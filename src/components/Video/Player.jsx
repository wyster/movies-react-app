import { useEffect, useRef, useState } from 'react'
import Cast from '../../utils/Cast';
import gql from "graphql-tag";
import {useQuery} from "@apollo/client/react";
import useCast from "../../hooks/cast";
import { createPlayer, videoFeatures } from '@videojs/react';
import { VideoSkin, Video } from '@videojs/react/video';

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
  const Player = createPlayer({ features: videoFeatures });
  const videoElement = useRef()
  const videoContainer = useRef()
  const [timer, setTimer] = useState(null)
  const {cast: myCastJs, myCast, setCast} = useCast();
  const { loading, error, data: movieData } = useQuery(GET_MOVIE_DETAILS, { variables: { id: movieId } })

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
    cast.on('available', (e) => {
      console.log(e, 'available');
      cast.time = currentTime;
      cast.cast(src, {
        poster : movieData?.movie?.poster,
        title : movieData?.movie?.name,
        description: movieData?.movie?.description,
      });
    });
    setCast(cast);
  }

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
        <Player.Provider>
          <VideoSkin>
            <Video src={src} playsInline />
          </VideoSkin>
        </Player.Provider>
      </div>
    </>
  )
}

export default Player
