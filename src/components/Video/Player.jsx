import { useEffect, useRef, useState } from 'react'
import video from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';
import { useVideoJS } from "react-hook-videojs";
import Cast from '../../utils/Cast';

function Player ({
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
    new Cast().cast(src);
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
