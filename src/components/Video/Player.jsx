import { useEffect, useRef, useState } from 'react'
import video from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import { useVideoJS } from "react-hook-videojs";
import Cast from '../../utils/Cast';
import gql from "graphql-tag";
import {useQuery} from "@apollo/client/react";

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
  const [myCast, setMyCast] = useState(null)
  const { loading, error, data: movieData } = useQuery(GET_MOVIE_DETAILS, { variables: { id: movieId } })

  const { Video, player, ready } = useVideoJS(
    { sources: [{ src: src }] },
  );

  function timeUpdate (e) {
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
    if (myCast) {
      if (myCast.src === src) {
        myCast.play();
        return;
      }
      myCast.cast(src, {
        poster : movieData?.movie?.poster,
        title : movieData?.movie?.name,
        description: movieData?.movie?.description,
      });
    }

    const cast = new Cast({
        joinpolicy: 'page_scoped',
      });
      cast.on('event', (e) => {
        if (e === 'disconnect') {
          setTimer(myCast.time);
          setMyCast(null);
        }
        console.log(e)
      });  // Catch all events except 'error'
      cast.on('error', (e) => console.log(e));  // Catch any errors
      if (!cast.available) {
        throw 'cast not available';
      }
      cast.cast(src, {
        poster : movieData?.movie?.poster,
        title : movieData?.movie?.name,
        description: movieData?.movie?.description,
      });
      setMyCast(cast);
  }

  useEffect(() => {
    setTimer(0);
  }, [movieId])

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
    if (!videoElement.current || !videoElement.current.paused) {
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
